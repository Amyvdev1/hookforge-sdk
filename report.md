# HookForge SDK: developer experience report

Author: Amy Villa. Date: 7 October 2026.

## Scope and outcome

I used the Voxgig generator to create a TypeScript SDK for my HookForge webhook reliability API. HookForge is a local simulation and debugging service, not a hosted webhook delivery platform. The SDK is a separate MIT-licensed project; no npm package was published.

A catalogue check with `gh repo list voxgig-sdk --limit 2000 --json name,description,url` returned 804 repositories and no case-insensitive HookForge match in their names or descriptions. This is a dated catalogue check, not a guarantee against future additions.

The input was the unmodified FastAPI OpenAPI 3.1 export from HookForge commit `6123c76e36533aaab3770c0cb3af8d573450fa00`. It describes six endpoints, typed request schemas, and validation constraints. Success response schemas are empty and the export has no server entry. Those are limitations of my API specification, not generator defects.

## Environment and method

- Windows, PowerShell, Node.js 24.19.0; Git Bash used for generated npm scripts.
- `@voxgig/create-sdkgen` 0.30.6; `@voxgig/apidef` 8.22.1; `@voxgig/sdkgen` pinned to 4.34.0.
- The real API ran with Uvicorn on `127.0.0.1:8765`; no third-party account or API key was used.
- Generated TypeScript source was not hand-edited. Adjustments were made to generator inputs and project configuration.

The first scaffold command was:

```sh
npx --yes @voxgig/create-sdkgen@0.30.6 hookforge -d ../../tmp/voxgig-task/hookforge-openapi.json -o ../hookforge-sdk -t ts -f test
```

After the interrupted scaffold and issues below, I completed the documented generation steps from `.sdk`:

```sh
npx voxgig-sdkgen target add ts
npx voxgig-sdkgen feature add test
npx voxgig-apidef hookforge -f . -d def/hookforge-openapi.json -p ''
npm run generate
npx voxgig-sdkgen doctor
```

## Observations and recommendations

1. **Dependency resolution blocked installation.** The scaffold allowed SDKGen 4.34.1, whose peer dependency required APIDef >=8.23.0, while the scaffold specified APIDef ~8.22.1. Pinning SDKGen to 4.34.0 resolved `ERESOLVE`. Recommendation: test the scaffold's complete resolved dependency set and ship compatible ranges.
2. **The scaffolder could not start npm on Windows.** A retry with `--no-install` failed during target addition with `spawn npm ENOENT`. Running the target and feature CLI commands directly worked. Recommendation: test Windows process spawning, including the no-install route, and show the manual recovery commands.
3. **Bare relative model imports failed to resolve.** Generation reported `source not found: api/api-info.aontu`, although the file existed. Adding explicit `./` prefixes to local imports in `model/sdk.aontu` and `test/test.aontu` fixed the observed behavior. Recommendation: generate explicit relative imports and cover Windows path resolution.
4. **Generated build scripts assumed a Unix shell.** Native Windows npm testing failed because `rm` was unavailable. Using the installed Git Bash as npm's script shell worked. Recommendation: use portable cleanup commands or document the shell requirement up front.
5. **A missing server default affected generated tests.** The API export omitted `servers`. I supplied the supported `server: 'http://127.0.0.1:8765'` option in `.sdk/build/apidef.js` and regenerated. Recommendation: clearly distinguish a missing API-spec default from an SDK runtime failure. Consumers can override `base`.
6. **Ownership metadata needs review for first-party APIs.** Defaults assumed a Voxgig organization and an unaffiliated third-party SDK. I configured Amy's author/repository/package metadata, preserved Voxgig attribution, and wrote the root README. Some generated target wording remains generic. Recommendation: offer a first-party API-owner option and validate lowercase npm scopes.

One failed iteration was mine: my rewritten README omitted the TypeScript Quickstart block expected by the generated documentation tests. Restoring that block fixed those failures; this is not reported as a generator bug.

## Validation

Generation completed successfully. SDKGen doctor reported that the scaffold matched. The generated test run finished with **218 tests: 217 passed, zero failed, one skipped**. These are generated/offline checks; they do not establish production readiness.

Separately, `node scripts/local-smoke.cjs` passed **eight real HTTP checks**, using generated SDK methods against the local API:

| Endpoint | Verified behavior |
| --- | --- |
| GET /health | Service identity |
| GET /api/capabilities | Nine capabilities |
| POST /api/evaluate | Complete receiver configuration scores 100 |
| POST /api/simulate | Duplicate deliveries identified and rejected |
| POST /api/sign | 64-character hexadecimal signature |
| POST /api/verify | Valid payload accepted; tampered payload rejected |
| POST /api/simulate | Invalid duplicate count rejects with HTTP 422 |

The signature input is an explicitly public test fixture, not a credential. A separate duplicate-delivery example is included. A small CI workflow repeats the generated tests and local API checks.

## Limits and timing

This was an AI-assisted exercise. The first observed session start was **07:19:24 America/Chicago**, with an interrupted scaffold and resumption at **07:22:42**. Repository preparation and verification were bounded to the same 30-minute elapsed window. This records the assistant's session, not a measured claim about Amy's hands-on time; her actual human time must be recorded separately.

Not evaluated: hosted deployment, authentication, Docker execution, browser SDK behavior, load, production webhook delivery, or npm publication. The README includes Docker instructions, but the executed API used Python/Uvicorn. Weak success response schemas limit generated response typing. Future API-spec improvements would be useful, but were deliberately outside this bounded exercise.

## References

- [Voxgig SDK tools](https://voxgig.com/sdk)
- [Voxgig generator documentation](https://voxgig.com/sdk/docs/create-sdkgen)
- [SDK catalogue](https://github.com/orgs/voxgig-sdk/repositories)
- [HookForge source](https://github.com/Amyvdev1/hookforge)
- [Preserved API specification](.sdk/def/hookforge-openapi.json)
