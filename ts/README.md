# Hookforge TypeScript SDK



The TypeScript SDK for the Hookforge API — a type-safe, entity-oriented client with full async/await support.

The API is exposed as capitalised, semantic **Entities** — e.g.
`client.Capability()` — each with a small set of operations (`load`, `create`)
instead of raw URL paths and query parameters. This keeps the surface
predictable and low-friction for both humans and AI agents.


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`, see [Releases](https://github.com/Amyvdev1/hookforge-sdk/releases)), or from a
clone, which carries the compiled `dist/`:

```bash
git clone https://github.com/Amyvdev1/hookforge-sdk
npm install ./hookforge-sdk/ts
```


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { HookforgeSDK } from '@amyvdev1/hookforge-sdk'

const client = new HookforgeSDK()
```

### 3. Load a capability

`load()` returns the entity directly and throws on failure:

```ts
try {
  const capability = await client.Capability().load()
  console.log(capability)
} catch (err) {
  console.error('load failed:', err)
}
```


## Error handling

Entity operations reject on failure, so wrap them in `try` / `catch`:

```ts
try {
  const capability = await client.Capability().load()
  console.log(capability)
} catch (err) {
  console.error('load failed:', err)
}
```

The low-level `direct()` method does **not** throw — it returns the
value or an `Error`, so check the result before using it:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example_id' },
})

if (result instanceof Error) {
  throw result
}
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result instanceof Error) {
  throw result
}
if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = HookforgeSDK.test()

const capability = await client.Capability().load()
// capability is the entity, populated with mock response data
// — call capability.data() for the record itself
console.log(capability)
```

You can also use the instance method:

```ts
const client = new HookforgeSDK()
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Capability()

// First call runs the operation and stores its result
await entity.load()

// Subsequent calls reuse the stored state
const data = entity.data()
console.log(data)
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new HookforgeSDK({
  extend: [logger],
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
HOOKFORGE_TEST_LIVE=TRUE
```

Then run:

```bash
cd ts && npm test
```

Live entity tests continue independent operations after errors and attempt
supported cleanup. Their final result reports failures and missing prerequisites
after the remaining work completes. The model and test inputs determine which
API operations the generated scenarios cover.


## Reference

### HookforgeSDK

#### Constructor

```ts
new HookforgeSDK(options?: {
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Capability(data?)` | `CapabilityEntity` | Create a Capability entity instance. |
| `Evaluate(data?)` | `EvaluateEntity` | Create an Evaluate entity instance. |
| `Health(data?)` | `HealthEntity` | Create a Health entity instance. |
| `Sign(data?)` | `SignEntity` | Create a Sign entity instance. |
| `Simulate(data?)` | `SimulateEntity` | Create a Simulate entity instance. |
| `Verify(data?)` | `VerifyEntity` | Create a Verify entity instance. |
| `tester(testopts?, sdkopts?)` | `HookforgeSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `HookforgeSDK.test(testopts?, sdkopts?)` | `HookforgeSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity. |
| `data` | `data(data?: Partial<Entity>): Entity` | Get or set entity data. |
| `match` | `match(match?: Partial<Entity>): Partial<Entity>` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): HookforgeSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity data directly — there is no
result envelope:

- `load` and `create` resolve to a single entity object.

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### Capability

| Field | Description |
| --- | --- |

Operations: load.

API path: `/api/capabilities`

#### Evaluate

| Field | Description |
| --- | --- |
| `capabilities` |  |
| `scenario` |  |

Operations: create.

API path: `/api/evaluate`

#### Health

| Field | Description |
| --- | --- |

Operations: load.

API path: `/health`

#### Sign

| Field | Description |
| --- | --- |
| `payload` |  |
| `secret` |  |
| `signature` |  |
| `timestamp` |  |

Operations: create.

API path: `/api/sign`

#### Simulate

| Field | Description |
| --- | --- |
| `capabilities` |  |
| `scenario` |  |

Operations: create.

API path: `/api/simulate`

#### Verify

| Field | Description |
| --- | --- |
| `payload` |  |
| `secret` |  |
| `signature` |  |
| `timestamp` |  |

Operations: create.

API path: `/api/verify`



## Entities


### Capability

Create an instance: `const capability = client.Capability()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Example: Load

```ts
const capability = await client.Capability().load()
```


### Evaluate

Create an instance: `const evaluate = client.Evaluate()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `capabilities` | `Record<string, any>` |  |
| `scenario` | `Record<string, any>` |  |

#### Example: Create

```ts
const evaluate = await client.Evaluate().create({
})
```


### Health

Create an instance: `const health = client.Health()`

#### Operations

| Method | Description |
| --- | --- |
| `load(match)` | Load a single entity by match criteria. |

#### Example: Load

```ts
const health = await client.Health().load()
```


### Sign

Create an instance: `const sign = client.Sign()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `payload` | `Record<string, any>` |  |
| `secret` | `string` |  |
| `signature` | `any` |  |
| `timestamp` | `number` |  |

#### Example: Create

```ts
const sign = await client.Sign().create({
  payload: {},
  timestamp: 1,
})
```


### Simulate

Create an instance: `const simulate = client.Simulate()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `capabilities` | `Record<string, any>` |  |
| `scenario` | `Record<string, any>` |  |

#### Example: Create

```ts
const simulate = await client.Simulate().create({
})
```


### Verify

Create an instance: `const verify = client.Verify()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `payload` | `Record<string, any>` |  |
| `secret` | `string` |  |
| `signature` | `any` |  |
| `timestamp` | `number` |  |

#### Example: Create

```ts
const verify = await client.Verify().create({
  payload: {},
  timestamp: 1,
})
```

## Features

This SDK ships 1 optional features. Each is **inactive until you
switch it on**, so an SDK you have not configured behaves exactly as if none of
them existed — no retries, no cache, no logging, no measurable overhead.

Activate a feature by name in the client options, alongside the options shown
above:

| Feature | What it does |
|---|---|
| [`test`](#test) | Test transport |

### test

Test transport.

| Option | Default |
|---|---|
| `active` | `false` |

Set `feature.test.active` to enable it, then override any of the options above.


## Advanced

> The sections above cover everyday use. The material below explains the
> SDK's internals — useful when extending it with custom features, but not
> needed for normal use.

### The operation pipeline

Every entity operation follows a six-stage pipeline. Each stage fires a
feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage errors, the pipeline short-circuits and the error surfaces
to the caller — see [Error handling](#error-handling) for how that looks
in this language.

### Features and hooks

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **TestFeature**: Test transport

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
hookforge/
├── src/
│   ├── HookforgeSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { HookforgeSDK } from '@amyvdev1/hookforge-sdk'
```

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const capability = client.Capability()
await capability.load()

// capability.data() now returns the capability data from the last `load`
// capability.match() returns the last match criteria
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
