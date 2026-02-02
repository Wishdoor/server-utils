/**
 * Common types used across the server utilities
 */

/**
 * Generic record type for key-value pairs
 */
export type AnyRecord = Record<string, unknown>;

/**
 * Sort direction for database queries
 */
export type SortDirection = "asc" | "desc";

/**
 * Result wrapper with success/error state
 */
export type Result<T, E = Error> =
	| { success: true; data: T }
	| { success: false; error: E };

/**
 * Async result type
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;
