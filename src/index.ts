/**
 * @wishdoor/server-utils
 *
 * Server-side utility functions for API development including
 * pagination and object utilities.
 */

// Re-export all modules
export * from "./types";
export * from "./pagination";
export * from "./utils";

// Named exports for commonly used functions
export {
	// Pagination
	generateWhereClause,
	generatePagination,
	createPaginatedResponse,
	paginateArray,
	getDisplayRange,
	generatePageNumbers,
	DEFAULT_PAGINATION_CONFIG,
} from "./pagination";

export {
	// Utils
	sanitizeObject,
	removeUndefined,
	removeNullish,
	removeFalsy,
	pick,
	omit,
	isPlainObject,
	deepClone,
	isEmpty,
} from "./utils";
