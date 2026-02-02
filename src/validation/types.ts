/**
 * Validation error item
 */
export interface ValidationErrorItem {
	field: string;
	message: string;
}

/**
 * Validation result
 */
export type ValidationResult<T> =
	| { success: true; data: T }
	| { success: false; errors: ValidationErrorItem[] };

/**
 * Custom error class for validation errors
 */
export class ValidationError extends Error {
	public readonly statusCode: number;
	public readonly code: string;
	public readonly errors: ValidationErrorItem[];

	constructor(
		message: string,
		errors: ValidationErrorItem[] = [],
		statusCode: number = 400
	) {
		super(message);
		this.name = "ValidationError";
		this.statusCode = statusCode;
		this.code = "VALIDATION_ERROR";
		this.errors = errors;
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}

/**
 * Parse ZodError into ValidationErrorItem array
 */
export function parseZodError(error: {
	errors: { path: (string | number)[]; message: string }[];
}): ValidationErrorItem[] {
	return error.errors.map((err) => ({
		field: err.path.join("."),
		message: err.message,
	}));
}
