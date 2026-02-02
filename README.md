# @wishdoor/server-utils

Server-side utility functions for API development including pagination and object utilities.

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

---

## Types

```typescript
import type {
	// Pagination
	PaginationQuery, // { page?, limit?, search?, sortBy?, sortOrder? }
	PaginationMeta, // { total, currentPage, pageSize, totalPages, hasNextPage, hasPreviousPage }
	PaginatedResponse, // { data: T[], pagination: PaginationMeta }
	DefaultSort, // { key: string, value: 'asc' | 'desc' }
	WhereClauseResult, // { where, orderBy, page, skip, limit }
	SortDirection, // 'asc' | 'desc'

	// Utils
	SanitizeObjectOptions,
} from "@wishdoor/server-utils";
```

---

## Module Imports

```typescript
import { generateWhereClause } from "@wishdoor/server-utils/pagination";
import { sanitizeObject } from "@wishdoor/server-utils/utils";
```

## License

MIT
