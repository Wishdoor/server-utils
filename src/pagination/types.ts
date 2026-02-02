/**
 * Pagination types and interfaces for Prisma-based APIs
 */

import type { SortDirection } from "../types";

// Re-export SortDirection for convenience
export type { SortDirection };

/**
 * Pagination query parameters (matches zod schema structure)
 */
export interface PaginationQuery {
	/** Current page number (1-indexed) */
	page?: number;
	/** Number of items per page */
	limit?: number;
	/** Search query string */
	search?: string;
	/** Field to sort by */
	sortBy?: string;
	/** Sort direction */
	sortOrder?: SortDirection;
}

/**
 * Default sort configuration
 */
export interface DefaultSort {
	/** Field to sort by */
	key: string;
	/** Sort direction */
	value: SortDirection;
}

/**
 * Parameters for generating where clause
 */
export interface GenerateWhereClauseParams<T> {
	/** Query parameters from request */
	query: PaginationQuery;
	/** Default sorting configuration */
	defaultSort: DefaultSort;
	/** Default where clause conditions */
	defaultWhere: T;
}

/**
 * Result of generateWhereClause function
 */
export interface WhereClauseResult<T> {
	/** Prisma where clause */
	where: T;
	/** Prisma orderBy clause */
	orderBy: Record<string, SortDirection>;
	/** Current page number */
	page: number;
	/** Number of records to skip */
	skip: number;
	/** Number of records per page */
	limit: number;
}

/**
 * Parameters for generating pagination metadata
 */
export interface GeneratePaginationParams {
	/** Total number of records */
	total: number;
	/** Current page number */
	page: number;
	/** Number of records per page */
	limit: number;
}

/**
 * Pagination metadata for API responses
 */
export interface PaginationMeta {
	/** Total number of records */
	total: number;
	/** Current page number */
	currentPage: number;
	/** Number of records per page */
	pageSize: number;
	/** Total number of pages */
	totalPages: number;
	/** Whether there is a next page */
	hasNextPage: boolean;
	/** Whether there is a previous page */
	hasPreviousPage: boolean;
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
	/** Array of items */
	data: T[];
	/** Pagination metadata */
	pagination: PaginationMeta;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
	/** Default number of items per page */
	defaultLimit: number;
	/** Maximum allowed items per page */
	maxLimit: number;
	/** Minimum allowed items per page */
	minLimit: number;
	/** Default page number */
	defaultPage: number;
}

/**
 * Default pagination configuration
 */
export const DEFAULT_PAGINATION_CONFIG: PaginationConfig = {
	defaultLimit: 20,
	maxLimit: 100,
	minLimit: 1,
	defaultPage: 1,
};
