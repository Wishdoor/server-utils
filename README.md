# @wishdoor/server-utils

Server-side utility functions for API development including pagination, validation, and object utilities.

## Installation

```bash
npm install @wishdoor/server-utils
```

## Pagination

### `generateWhereClause`

Generates Prisma-compatible `where`, `orderBy`, and pagination parameters from query params.

```typescript
import { generateWhereClause } from "@wishdoor/server-utils";

const { where, orderBy, skip, limit, page } = generateWhereClause({
	query: { page: 2, limit: 10, sortBy: "name", sortOrder: "asc" },
	defaultSort: { key: "createdAt", value: "desc" },
	defaultWhere: { status: "ACTIVE" },
});

const users = await prisma.user.findMany({ where, orderBy, skip, take: limit });
```

### `generatePagination`

Generates pagination metadata for API responses.

```typescript
import { generatePagination } from "@wishdoor/server-utils";

const pagination = generatePagination({ total: 150, page: 3, limit: 20 });
// { total, currentPage, pageSize, totalPages, hasNextPage, hasPreviousPage }
```

### `createPaginatedResponse`

Combines data array with pagination metadata.

```typescript
import { createPaginatedResponse } from "@wishdoor/server-utils";

const users = await prisma.user.findMany({ where, orderBy, skip, take: limit });
const total = await prisma.user.count({ where });

return createPaginatedResponse(users, total, page, limit);
// { data: [...], pagination: { total, currentPage, pageSize, totalPages, ... } }
```

---

## Validation

### `validateMiddleware`

Express middleware for validating request `body`, `query`, and `params` using Zod.

Schema structure:

```typescript
{
  body?: ZodSchema,
  query?: ZodSchema,
  params?: ZodSchema
}
```

```typescript
import { z } from "zod";
import { validateMiddleware } from "@wishdoor/server-utils";

const createUserSchema = z.object({
	body: z.object({
		name: z.string().min(2),
		email: z.string().email(),
	}),
	query: z.object({
		redirect: z.string().optional(),
	}),
	params: z.object({
		orgId: z.string(),
	}),
});

router.post(
	"/orgs/:orgId/users",
	validateMiddleware(createUserSchema),
	createUser
);
```

On validation error, throws `ValidationError` with `statusCode: 400` and `errors: [{ field, message }]`.

### `validate`

Standalone validation function (not middleware).

```typescript
import { z } from "zod";
import { validate } from "@wishdoor/server-utils";

const userSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
});

const result = validate(userSchema, { name: "John", email: "invalid" });

if (result.success) {
	console.log(result.data);
} else {
	console.log(result.errors); // [{ field: 'email', message: 'Invalid email' }]
}
```

---

## Utils

### `sanitizeObject`

Removes unwanted values from an object (undefined, null, empty strings, etc).

```typescript
import { sanitizeObject } from "@wishdoor/server-utils";

const obj = { a: 1, b: null, c: "", d: undefined, e: 0 };

sanitizeObject(obj);
// { a: 1, b: null, c: '', e: 0 } - removes undefined by default

sanitizeObject(obj, { removeNull: true, removeEmptyString: true });
// { a: 1, e: 0 }

sanitizeObject(obj, { removeNull: true, excludeKeys: ["b"] });
// { a: 1, b: null, c: '', e: 0 } - keeps excluded keys
```

**Options:**

- `removeUndefined` - default: `true`
- `removeNull` - default: `false`
- `removeEmptyString` - default: `false`
- `removeZero` - default: `false`
- `removeNaN` - default: `false`
- `excludeKeys` - keys to skip
- `includeKeys` - only process these keys

### `buildQueryString`

Builds a query string from key-value pairs.

```typescript
import { buildQueryString } from "@wishdoor/server-utils";

buildQueryString({ page: 1, limit: 10 });
// "page=1&limit=10"

buildQueryString({ tags: ["a", "b"], active: true });
// "tags=a&tags=b&active=true"

buildQueryString({ page: 1, search: undefined });
// "page=1" - undefined/null values are skipped
```

### `generateUrl`

Generates a complete API URL from base URL, path, and query params.

```typescript
import { generateUrl } from "@wishdoor/server-utils";

// Uses process.env.API_URL as base
generateUrl("/users");
// "https://api.example.com/users"

generateUrl("/users", { page: 1, limit: 10 });
// "https://api.example.com/users?page=1&limit=10"

// With custom base URL
generateUrl("/users/123", undefined, "https://custom-api.com");
// "https://custom-api.com/users/123"
```

### `buildUrl`

Builds a URL with path parameters replaced.

```typescript
import { buildUrl } from "@wishdoor/server-utils";

buildUrl("/users/:id", { id: "123" });
// "https://api.example.com/users/123"

buildUrl(
	"/orgs/:orgId/users/:userId",
	{ orgId: "abc", userId: "123" },
	{ active: true }
);
// "https://api.example.com/orgs/abc/users/123?active=true"
```

---

## Additional Functions

### Pagination

| Function                                    | Description                               |
| ------------------------------------------- | ----------------------------------------- |
| `paginateArray(items, page, limit)`         | Paginate an in-memory array               |
| `getDisplayRange(page, limit, total)`       | Get `{ from, to }` for "Showing X-Y of Z" |
| `generatePageNumbers(current, total, max?)` | Generate page numbers for UI              |

### Utils

| Function               | Description                  |
| ---------------------- | ---------------------------- |
| `removeUndefined(obj)` | Remove only undefined values |
| `removeNullish(obj)`   | Remove null and undefined    |
| `removeFalsy(obj)`     | Remove all falsy values      |
| `pick(obj, keys)`      | Pick specific keys           |
| `omit(obj, keys)`      | Omit specific keys           |
| `isPlainObject(value)` | Check if plain object        |
| `deepClone(obj)`       | Deep clone via JSON          |
| `isEmpty(obj)`         | Check if object has no keys  |

### Validation

| Function                        | Description                                |
| ------------------------------- | ------------------------------------------ |
| `validateAsync(schema, data)`   | Async version of validate                  |
| `validateOrThrow(schema, data)` | Validate and throw on error                |
| `validateRequest`               | Alias for validateMiddleware               |
| `ValidationError`               | Error class thrown by middleware           |
| `parseZodError(error)`          | Convert ZodError to `{ field, message }[]` |

---

## Types

```typescript
import type {
	// Pagination
	PaginationQuery, // { page?, limit?, search?, sortBy?, sortOrder? }
	PaginationMeta, // { total, currentPage, pageSize, totalPages, ... }
	PaginatedResponse, // { data: T[], pagination: PaginationMeta }
	DefaultSort, // { key: string, value: 'asc' | 'desc' }
	WhereClauseResult, // { where, orderBy, page, skip, limit }
	SortDirection, // 'asc' | 'desc'

	// Validation
	ValidationResult, // { success, data } | { success, errors }
	ValidationErrorItem, // { field, message }

	// Utils
	SanitizeObjectOptions,
	QueryParamsObject, // Record<string, string | number | boolean | ...>
} from "@wishdoor/server-utils";
```

---

## Module Imports

```typescript
import { generateWhereClause } from "@wishdoor/server-utils/pagination";
import { sanitizeObject } from "@wishdoor/server-utils/utils";
import { validateMiddleware } from "@wishdoor/server-utils/validation";
```

## License

MIT
