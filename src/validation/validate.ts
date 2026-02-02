import type { ZodType } from "zod";
import type { ValidationResult } from "./types";
import { parseZodError } from "./types";

/**
 * Validate data against a Zod schema
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with either parsed data or errors
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { validate } from '@wishdoor/server-utils';
 *
 * const userSchema = z.object({
 *   name: z.string().min(2),
 *   email: z.string().email(),
 * });
 *
 * const result = validate(userSchema, { name: 'John', email: 'john@example.com' });
 *
 * if (result.success) {
 *   console.log(result.data); // typed data
 * } else {
 *   console.log(result.errors); // [{ field: 'email', message: '...' }]
 * }
 * ```
 */
export function validate<T>(
	schema: ZodType<T>,
	data: unknown
): ValidationResult<T> {
	const result = schema.safeParse(data);

	if (result.success) {
		return { success: true, data: result.data };
	}

	return {
		success: false,
		errors: parseZodError(result.error),
	};
}

/**
 * Validate data against a Zod schema (async version)
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Promise with validation result
 */
export async function validateAsync<T>(
	schema: ZodType<T>,
	data: unknown
): Promise<ValidationResult<T>> {
	const result = await schema.safeParseAsync(data);

	if (result.success) {
		return { success: true, data: result.data };
	}

	return {
		success: false,
		errors: parseZodError(result.error),
	};
}

/**
 * Validate and throw on error
 *
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Parsed data if valid
 * @throws Error with validation errors if invalid
 */
export function validateOrThrow<T>(schema: ZodType<T>, data: unknown): T {
	const result = schema.safeParse(data);

	if (result.success) {
		return result.data;
	}

	const errors = parseZodError(result.error);
	const error = new Error(errors[0]?.message ?? "Validation failed") as Error & {
		errors: typeof errors;
		statusCode: number;
	};
	error.errors = errors;
	error.statusCode = 400;
	throw error;
}
