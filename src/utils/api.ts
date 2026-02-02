/**
 * API utility functions
 */

/**
 * Query parameter value types
 */
export type QueryParamValue = string | number | boolean | undefined | null;

/**
 * Query parameters object
 */
export type QueryParamsObject = Record<
	string,
	QueryParamValue | QueryParamValue[]
>;

/**
 * Builds a query string from a record of key-value pairs.
 *
 * @param queryParams - The record of key-value pairs to build the query string from
 * @returns The query string (without leading "?")
 *
 * @example
 * buildQueryString({ page: 1, limit: 10 });
 * // "page=1&limit=10"
 *
 * @example
 * buildQueryString({ tags: ['a', 'b'], active: true });
 * // "tags=a&tags=b&active=true"
 *
 * @example
 * buildQueryString({ page: 1, search: undefined });
 * // "page=1" - undefined values are skipped
 */
export function buildQueryString(queryParams?: QueryParamsObject): string {
	if (!queryParams) return "";

	const searchParams = new URLSearchParams();

	Object.entries(queryParams).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			if (Array.isArray(value)) {
				value.forEach((item) => {
					if (item !== undefined && item !== null) {
						searchParams.append(key, item.toString());
					}
				});
			} else {
				searchParams.append(key, value.toString());
			}
		}
	});

	return searchParams.toString();
}

/**
 * Options for generateUrl function
 */
export interface GenerateUrlOptions {
	/** Base URL (defaults to process.env.API_URL) */
	baseUrl?: string;
	/** Query parameters to append */
	queryParams?: QueryParamsObject;
}

/**
 * Generates a complete API URL by combining a base URL with an endpoint path.
 *
 * @param path - The API endpoint path (e.g., "/users", "/users/123")
 * @param queryParams - Optional query parameters to append
 * @param baseUrl - Optional base URL (defaults to process.env.API_URL)
 * @returns The complete URL
 *
 * @example
 * generateUrl("/users");
 * // "https://api.example.com/users" (using API_URL env)
 *
 * @example
 * generateUrl("/users", { page: 1, limit: 10 });
 * // "https://api.example.com/users?page=1&limit=10"
 *
 * @example
 * generateUrl("/users/123", undefined, "https://custom-api.com");
 * // "https://custom-api.com/users/123"
 *
 * @example
 * generateUrl("/search", { q: "test", tags: ["a", "b"] });
 * // "https://api.example.com/search?q=test&tags=a&tags=b"
 */
export function generateUrl(
	path: string,
	queryParams?: QueryParamsObject,
	baseUrl?: string
): string {
	const base = baseUrl ?? "";

	if (!base) {
		throw new Error("Base URL is required. Provide baseUrl parameter.");
	}

	const queryString = buildQueryString(queryParams);
	const pathWithQuery = queryString ? `${path}?${queryString}` : path;

	return `${base}${pathWithQuery}`;
}

/**
 * Builds a URL with path parameters replaced.
 *
 * @param path - The path template with placeholders (e.g., "/users/:id")
 * @param params - The parameters to replace in the path
 * @param queryParams - Optional query parameters
 * @param baseUrl - Optional base URL
 * @returns The complete URL with parameters replaced
 *
 * @example
 * buildUrl("/users/:id", { id: "123" });
 * // "https://api.example.com/users/123"
 *
 * @example
 * buildUrl("/orgs/:orgId/users/:userId", { orgId: "abc", userId: "123" }, { active: true });
 * // "https://api.example.com/orgs/abc/users/123?active=true"
 */
export function buildUrl(
	path: string,
	params: Record<string, string | number>,
	queryParams?: QueryParamsObject,
	baseUrl?: string
): string {
	let resolvedPath = path;

	Object.entries(params).forEach(([key, value]) => {
		resolvedPath = resolvedPath.replace(`:${key}`, String(value));
	});

	return generateUrl(resolvedPath, queryParams, baseUrl);
}
