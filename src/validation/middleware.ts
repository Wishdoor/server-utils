import type { NextFunction, Request, Response } from "express";
import type { AnyZodObject } from "zod";
import { ValidationError, parseZodError } from "./types";

/**
 * Express middleware for validating request body, query, and params
 *
 * The schema should have the structure: { body?: ZodSchema, query?: ZodSchema, params?: ZodSchema }
 *
 * @param schema - Zod object schema with optional body, query, params keys
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * import { z } from 'zod';
 * import { validateMiddleware } from '@wishdoor/server-utils';
 *
 * const createUserSchema = z.object({
 *   body: z.object({
 *     name: z.string().min(2),
 *     email: z.string().email(),
 *   }),
 *   query: z.object({
 *     redirect: z.string().optional(),
 *   }),
 * });
 *
 * router.post('/users', validateMiddleware(createUserSchema), createUser);
 * ```
 */
export function validateMiddleware(schema: AnyZodObject) {
	return async (req: Request, _res: Response, next: NextFunction) => {
		try {
			const dataToValidate: Record<string, unknown> = {};
			const shape = schema.shape as Record<string, unknown>;

			if (shape["body"]) {
				dataToValidate["body"] = req.body;
			}

			if (shape["query"]) {
				dataToValidate["query"] = req.query;
			}

			if (shape["params"]) {
				dataToValidate["params"] = req.params;
			}

			const validated = (await schema.parseAsync(dataToValidate)) as Record<
				string,
				unknown
			>;

			if (validated["body"] !== undefined) {
				req.body = validated["body"];
			}
			if (validated["query"] !== undefined) {
				req.query = validated["query"] as typeof req.query;
			}
			if (validated["params"] !== undefined) {
				req.params = validated["params"] as typeof req.params;
			}

			next();
		} catch (error: unknown) {
			if (
				error &&
				typeof error === "object" &&
				"errors" in error &&
				Array.isArray((error as { errors: unknown[] }).errors)
			) {
				// ZodError
				const errors = parseZodError(
					error as { errors: { path: (string | number)[]; message: string }[] }
				);
				next(
					new ValidationError(errors[0]?.message ?? "Validation failed", errors)
				);
			} else {
				next(error);
			}
		}
	};
}

/**
 * Alias for validateMiddleware
 */
export const validateRequest = validateMiddleware;
