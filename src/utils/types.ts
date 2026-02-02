/**
 * General utility types
 */

/**
 * Options for sanitizing an object
 */
export interface SanitizeObjectOptions<T extends Record<string, unknown>> {
  /** Whether to remove undefined values (default: true) */
  removeUndefined?: boolean;
  /** Whether to remove null values (default: false) */
  removeNull?: boolean;
  /** Whether to remove empty string values (default: false) */
  removeEmptyString?: boolean;
  /** Whether to remove zero values (default: false) */
  removeZero?: boolean;
  /** Whether to remove NaN values (default: false) */
  removeNaN?: boolean;
  /** Keys to exclude from sanitization */
  excludeKeys?: (keyof T)[];
  /** Keys to include in sanitization (if provided, only these keys are processed) */
  includeKeys?: (keyof T)[];
}
