import type { SanitizeObjectOptions } from './types';

/**
 * Sanitize an object by removing undefined, null, empty string, zero, and NaN values
 * 
 * @param obj - The object to sanitize
 * @param options - The options to sanitize the object
 * @returns The sanitized object
 *
 * @example
 * ```typescript
 * const obj = { a: 1, b: null, c: "", d: 0, e: NaN, f: undefined };
 * 
 * // Default: only removes undefined
 * sanitizeObject(obj);
 * // { a: 1, b: null, c: "", d: 0, e: NaN }
 * 
 * // Remove null values as well
 * sanitizeObject(obj, { removeNull: true });
 * // { a: 1, c: "", d: 0, e: NaN }
 * 
 * // Remove multiple types
 * sanitizeObject(obj, { removeNull: true, removeEmptyString: true, removeNaN: true });
 * // { a: 1, d: 0 }
 * 
 * // Exclude specific keys from sanitization
 * sanitizeObject(obj, { removeNull: true, excludeKeys: ['b'] });
 * // { a: 1, b: null, c: "", d: 0, e: NaN }
 * 
 * // Only process specific keys
 * sanitizeObject(obj, { removeNull: true, includeKeys: ['a', 'b'] });
 * // { a: 1 }
 * ```
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  options?: SanitizeObjectOptions<T>
): Partial<T> {
  const {
    removeUndefined = true,
    removeNull = false,
    removeEmptyString = false,
    removeZero = false,
    removeNaN = false,
    excludeKeys = [],
    includeKeys = [],
  } = options ?? {};

  const result: Partial<T> = {};

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    // Skip excluded keys
    if (excludeKeys.length > 0 && excludeKeys.includes(key)) {
      result[key] = obj[key];
      continue;
    }

    // Skip keys not in includeKeys (if includeKeys is specified)
    if (includeKeys.length > 0 && !includeKeys.includes(key)) {
      result[key] = obj[key];
      continue;
    }

    const value = obj[key];

    // Check conditions for removal
    if (removeUndefined && value === undefined) continue;
    if (removeNull && value === null) continue;
    if (removeEmptyString && value === '') continue;
    if (removeZero && value === 0) continue;
    if (removeNaN && typeof value === 'number' && Number.isNaN(value)) continue;

    result[key] = value;
  }

  return result;
}

/**
 * Remove undefined values from an object (convenience function)
 */
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return sanitizeObject(obj, { removeUndefined: true });
}

/**
 * Remove null and undefined values from an object (convenience function)
 */
export function removeNullish<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return sanitizeObject(obj, { removeUndefined: true, removeNull: true });
}

/**
 * Remove all falsy values from an object (undefined, null, empty string, 0, NaN, false)
 */
export function removeFalsy<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    if (value) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Pick specific keys from an object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * Omit specific keys from an object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };

  for (const key of keys) {
    delete result[key];
  }

  return result as Omit<T, K>;
}

/**
 * Check if a value is a plain object
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Deep clone an object (simple implementation using JSON)
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

/**
 * Check if an object is empty (has no own enumerable properties)
 */
export function isEmpty(obj: Record<string, unknown>): boolean {
  return Object.keys(obj).length === 0;
}
