# HookForge SDK

A TypeScript SDK for [HookForge](https://github.com/Amyvdev1/hookforge), generated with the Voxgig SDK toolchain for its first mini task. Maintained by Amy Villa.

HookForge is a local webhook reliability workbench. Its API evaluates receiver capabilities, simulates deliveries, and signs/verifies fixture payloads. It does not deliver real webhooks or require an API key.

This SDK is not published to npm. Clone and build it locally. Read [the developer-experience report](report.md) for the generator findings and exact verification results.

## Start the API

Use the existing public HookForge repository at commit `6123c76e36533aaab3770c0cb3af8d573450fa00`:

```sh
git clone https://github.com/Amyvdev1/hookforge.git
cd hookforge
git checkout 6123c76e36533aaab3770c0cb3af8d573450fa00
docker build -t hookforge-api .
docker run --rm -p 127.0.0.1:8765:8000 hookforge-api
```

Alternatively, install its requirements in a Python virtual environment and run `python -m uvicorn app.main:app --host 127.0.0.1 --port 8765`. The actual test run used Python/Uvicorn; Docker instructions use the existing upstream Dockerfile but were not executed in this task.

OpenAPI is available at `http://127.0.0.1:8765/openapi.json`. The unmodified exported contract is included at [.sdk/def/hookforge-openapi.json](.sdk/def/hookforge-openapi.json). The generator's API build configuration supplies the default loopback base URL because the original contract has no servers entry.

## Build and use the SDK

Requires Node.js 24 or later. From this repository:

```sh
cd ts
npm ci
npm test
cd ..
node examples/duplicate-delivery.cjs
node scripts/local-smoke.cjs
```

On Windows, the generated build script requires Git Bash because it uses `rm -rf`. From the repository root, install dependencies and run:

```powershell
npm ci --prefix ts
npm --prefix ts --script-shell="C:/Program Files/Git/bin/bash.exe" test
node examples/duplicate-delivery.cjs
node scripts/local-smoke.cjs
```

The [minimal runnable example](examples/duplicate-delivery.cjs) imports `HookforgeSDK` from `ts/dist/HookforgeSDK.js`, constructs a client with `{ base: 'http://127.0.0.1:8765' }`, calls `client.Simulate().create(...)`, and reads the returned entity with `.data()`. Set `HOOKFORGE_BASE_URL` to use another instance; the example and smoke test read it. No credentials are needed. The explicit signing secret in the smoke test is a public fixture, never a real credential.

## Quickstart

After building, this TypeScript example uses the real local API. The generated documentation tests replace the client with a seeded offline client when checking this example.

```ts
import { HookforgeSDK } from './ts/dist/HookforgeSDK'

const client = new HookforgeSDK({ base: 'http://127.0.0.1:8765' })
const health = await client.Health().load()
console.log(health.data())
```

## API coverage

| Endpoint | Generated method | Local verification |
| --- | --- | --- |
| GET /health | Health().load() | Service identity |
| GET /api/capabilities | Capability().load() | Nine capabilities |
| POST /api/evaluate | Evaluate().create(...) | Fully capable receiver scores 100 |
| POST /api/simulate | Simulate().create(...) | Duplicate rejection and invalid-input failure |
| POST /api/sign | Sign().create(...) | SHA-256 HMAC output |
| POST /api/verify | Verify().create(...) | Valid and tampered payloads |

The SDK's generated offline tests use mock transport. `scripts/local-smoke.cjs` uses real HTTP against the local API and asserts results. These are separate evidence sources, not proof of production operation.

## Regenerate

The checked-in project has reproducible lockfiles and the small workarounds described in the report:

```sh
cd .sdk
npm ci
npm run generate
npx voxgig-sdkgen doctor
```

Generator versions: create-sdkgen 0.30.6, sdkgen 4.34.0, apidef 8.22.1. The original scaffold's sdkgen range admitted 4.34.1, whose peer requirement conflicted with the parser range; the SDKGen version is now pinned. Explicit relative includes resolve the observed Windows model-loader errors. Project metadata is in `.sdk/model/project.aontu`; API base configuration is in `.sdk/build/apidef.js`.

Generated code lives in `ts/`. Change generator inputs, not emitted TypeScript. Root documentation is authored separately and protected by disabling the generator's top-level phase. No package release or external webhook delivery is configured by this task.

## Limitations

- The API runs locally; there is no hosted HookForge service behind this SDK.
- Original success-response schemas are empty. Request bodies are partially typed, but response types and nested objects are broad. Runtime smoke tests do not supply missing compile-time guarantees.
- HookForge simulates webhook behavior; it does not validate a real external receiver.
- No authentication, production deployment, throughput, browser compatibility, or Docker runtime test was performed.
- Some generated descriptions still use generic third-party/non-affiliation wording even though Amy owns this API; see the report.

## License

MIT. Amy Villa's authored project materials and contributions are credited in the root license; existing Voxgig generator/template notices are retained. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
