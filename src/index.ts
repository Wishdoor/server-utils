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
export * from "./validation";

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
	// API Utils
	buildQueryString,
	generateUrl,
	buildUrl,
} from "./utils";

export {
	// Validation
	validate,
	validateAsync,
	validateOrThrow,
	validateMiddleware,
	validateRequest,
	ValidationError,
	parseZodError,
} from "./validation";
