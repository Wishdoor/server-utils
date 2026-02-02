/**
 * @wishdoor/server-utils
 *
 * Server-side utility functions for API development including
 * pagination and object utilities.
 */

import {
	generatePagination,
	generateWhereClause,
	createPaginatedResponse,
	paginateArray,
	getDisplayRange,
	generatePageNumbers,
	DEFAULT_PAGINATION_CONFIG,
	sanitizeObject,
	removeUndefined,
	removeNullish,
	removeFalsy,
	pick,
	omit,
	isPlainObject,
	deepClone,
	isEmpty,
	buildQueryString,
	generateUrl,
	buildUrl,
	validate,
	validateAsync,
	validateOrThrow,
	validateMiddleware,
	validateRequest,
	ValidationError,
	parseZodError,
} from ".";

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

export const pagination = {
	generateWhereClause,
	generatePagination,
	createPaginatedResponse,
	paginateArray,
	getDisplayRange,
	generatePageNumbers,
	DEFAULT_PAGINATION_CONFIG,
};

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

export const utils = {
	sanitizeObject,
	removeUndefined,
	removeNullish,
	removeFalsy,
	pick,
	omit,
	isPlainObject,
	deepClone,
	isEmpty,
	buildQueryString,
	generateUrl,
	buildUrl,
};

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

export const validation = {
	validate,
	validateAsync,
	validateOrThrow,
	validateMiddleware,
	validateRequest,
	ValidationError,
	parseZodError,
};
