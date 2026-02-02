import type {
	PaginationQuery,
	DefaultSort,
	WhereClauseResult,
	PaginationMeta,
	PaginatedResponse,
	SortDirection,
	PaginationConfig,
} from "./types";
import { DEFAULT_PAGINATION_CONFIG } from "./types";

/**
 * Generates a Prisma-compatible where clause, orderBy clause, and pagination parameters
 * from query parameters with support for default sorting and filtering.
 *
 * @template T - The Prisma where input type (e.g., Prisma.UserWhereInput)
 *
 * @param query - Query parameters containing page, limit, sortBy, sortOrder, and search
 * @param defaultSort - Default sorting configuration
 * @param defaultWhere - Default where clause conditions (merged with query filters)
 * @param config - Optional pagination configuration
 *
 * @returns Object containing where, orderBy, page, skip, and limit
 *
 * @example
 * ```typescript
 * const { where, orderBy, skip, limit, page } = generateWhereClause({
 *   query: { page: 2, limit: 10, sortBy: "name", sortOrder: "asc" },
 *   defaultSort: { key: "createdAt", value: "desc" },
 *   defaultWhere: { status: "ACTIVE" }
 * });
 *
 * const users = await prisma.user.findMany({
 *   where,
 *   orderBy,
 *   skip,
 *   take: limit,
 * });
 * ```
 */
export function generateWhereClause<T>({
	query,
	defaultSort,
	defaultWhere,
	config = DEFAULT_PAGINATION_CONFIG,
}: {
	query: PaginationQuery;
	defaultSort: DefaultSort;
	defaultWhere: T;
	config?: Partial<PaginationConfig>;
}): WhereClauseResult<T> {
	const mergedConfig = { ...DEFAULT_PAGINATION_CONFIG, ...config };

	const page = Math.max(query.page ?? mergedConfig.defaultPage, 1);
	const limit = Math.min(
		Math.max(query.limit ?? mergedConfig.defaultLimit, mergedConfig.minLimit),
		mergedConfig.maxLimit
	);
	const skip = (page - 1) * limit;

	const orderBy: Record<string, SortDirection> = {};

	if (query.sortBy && query.sortOrder) {
		orderBy[query.sortBy] = query.sortOrder;
	} else {
		orderBy[defaultSort.key] = defaultSort.value;
	}

	const where: T = {
		...defaultWhere,
	};

	return {
		where,
		orderBy,
		page,
		skip,
		limit,
	};
}

/**
 * Generates pagination metadata to return to the frontend from total count,
 * current page, and page size.
 *
 * @param total - Total number of records matching the query
 * @param page - Current page number (1-indexed)
 * @param limit - Number of records per page
 *
 * @returns Pagination metadata object
 *
 * @example
 * ```typescript
 * const pagination = generatePagination({
 *   total: 150,
 *   page: 3,
 *   limit: 20
 * });
 * // Returns: {
 * //   total: 150,
 * //   currentPage: 3,
 * //   pageSize: 20,
 * //   totalPages: 8,
 * //   hasNextPage: true,
 * //   hasPreviousPage: true
 * // }
 * ```
 */
export function generatePagination({
	total,
	page,
	limit,
}: {
	total: number;
	page: number;
	limit: number;
}): PaginationMeta {
	const totalPages = Math.ceil(total / limit) || 1;

	return {
		total,
		currentPage: page,
		pageSize: limit,
		totalPages,
		hasNextPage: page < totalPages,
		hasPreviousPage: page > 1,
	};
}

/**
 * Creates a paginated response object with data and pagination metadata
 *
 * @param data - Array of items
 * @param total - Total number of records
 * @param page - Current page number
 * @param limit - Number of records per page
 *
 * @returns Paginated response object
 *
 * @example
 * ```typescript
 * const users = await prisma.user.findMany({ where, orderBy, skip, take: limit });
 * const total = await prisma.user.count({ where });
 *
 * return createPaginatedResponse(users, total, page, limit);
 * ```
 */
export function createPaginatedResponse<T>(
	data: T[],
	total: number,
	page: number,
	limit: number
): PaginatedResponse<T> {
	return {
		data,
		pagination: generatePagination({ total, page, limit }),
	};
}

/**
 * Paginate an array of items (client-side pagination)
 *
 * @param items - Full array of items
 * @param page - Current page number
 * @param limit - Number of items per page
 *
 * @returns Paginated response with sliced data
 */
export function paginateArray<T>(
	items: T[],
	page: number,
	limit: number
): PaginatedResponse<T> {
	const total = items.length;
	const skip = (page - 1) * limit;
	const data = items.slice(skip, skip + limit);

	return createPaginatedResponse(data, total, page, limit);
}

/**
 * Get the display range of items (e.g., "Showing 21-40 of 150")
 *
 * @param page - Current page number
 * @param limit - Number of items per page
 * @param total - Total number of items
 *
 * @returns Object with from and to values
 */
export function getDisplayRange(
	page: number,
	limit: number,
	total: number
): { from: number; to: number } {
	const from = Math.min((page - 1) * limit + 1, total);
	const to = Math.min(page * limit, total);
	return { from, to };
}

/**
 * Generate an array of page numbers for pagination UI
 *
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @param maxVisible - Maximum number of page buttons to show
 *
 * @returns Array of page numbers with optional 'ellipsis' markers
 */
export function generatePageNumbers(
	currentPage: number,
	totalPages: number,
	maxVisible: number = 5
): (number | "ellipsis")[] {
	if (totalPages <= maxVisible) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const pages: (number | "ellipsis")[] = [];
	const halfVisible = Math.floor((maxVisible - 3) / 2);

	// Always show first page
	pages.push(1);

	if (currentPage <= halfVisible + 2) {
		// Near the beginning
		for (let i = 2; i <= maxVisible - 2; i++) {
			pages.push(i);
		}
		pages.push("ellipsis");
	} else if (currentPage >= totalPages - halfVisible - 1) {
		// Near the end
		pages.push("ellipsis");
		for (let i = totalPages - maxVisible + 3; i < totalPages; i++) {
			pages.push(i);
		}
	} else {
		// Middle
		pages.push("ellipsis");
		for (
			let i = currentPage - halfVisible;
			i <= currentPage + halfVisible;
			i++
		) {
			pages.push(i);
		}
		pages.push("ellipsis");
	}

	// Always show last page
	pages.push(totalPages);

	return pages;
}
