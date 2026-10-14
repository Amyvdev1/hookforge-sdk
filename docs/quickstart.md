# From a fresh clone to an explained result

**Goal:** use a generated TypeScript client over real local HTTP, then distinguish duplicate delivery from event ordering. HookForge simulates a receiver; it does not send external webhooks.

## Before you start

- Git, Python 3.11+ and Node.js 24+ with npm.
- Windows: Git Bash at `C:/Program Files/Git/bin/bash.exe` for the generated build script. Use PowerShell for the commands below.
- Internet access for the initial clones and dependency installation. No API key, account or paid service is needed.
- Two terminals. Keep the API running in the first while using the SDK in the second.

## 1. Start the API — terminal one

Use a new working folder. Pin the API to the contract version tested by this SDK:

```sh
git clone https://github.com/Amyvdev1/hookforge.git
cd hookforge
git checkout 6123c76e36533aaab3770c0cb3af8d573450fa00
python -m venv .venv
```

**Windows PowerShell:**

```powershell
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8765
```

**macOS / Linux** (use `python3` above if `python` is unavailable):

```sh
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8765
```

Open <http://127.0.0.1:8765/health>. Expect `status: "ok"`, `service: "hookforge"`, and `version: "1.0.0"`. If the server has not started, resolve that before building the client.

## 2. Build the SDK — terminal two

From your working folder, alongside the API clone:

```sh
git clone https://github.com/Amyvdev1/hookforge-sdk.git
cd hookforge-sdk
npm ci --prefix ts
```

**Windows PowerShell:**

```powershell
npm --prefix ts --script-shell="C:/Program Files/Git/bin/bash.exe" test
```

**macOS / Linux:**

```sh
npm test --prefix ts
```

This builds the client and runs the generated offline tests. Those tests use mock transport; they do not prove the API is reachable.

## 3. Make your first real local request

```sh
node examples/health.cjs
```

Expect the same service identity as the browser health check. Read the six-line example: construct the client, load the resource, then read `.data()` from the returned entity.

## 4. Explain two different reliability decisions

```sh
node examples/duplicate-delivery.cjs
node examples/out-of-order.cjs
```

| Example | Input | Expected local simulation | What to explain |
| --- | --- | --- | --- |
| Duplicate delivery | Three copies of the first event, then a second event; correct order | Two accepted deliveries and two duplicates | Repeated event identity does not repeat the simulated effect. |
| Out of order | One newer event before one older event | One accepted delivery; older event rejected as stale | An event can be authentic and unique but still arrive too late for this receiver policy. |

Both enable only the capabilities needed for the lesson. A low overall capability score is expected; this is not a fully hardened receiver configuration or a production-security assessment.

## 5. Verify the transport and behavior

```sh
node scripts/local-smoke.cjs
```

Expect eight passing HTTP checks: identity, capabilities, evaluation, duplicates, signing, valid verification, tampering, and invalid input. The API is local; receiver behavior remains simulated. Read [the report](../report.md) for generator findings and the original verification boundaries.

## When something goes wrong

| Symptom | Next action |
| --- | --- |
| Connection refused | Keep terminal one running; check `/health` and the selected port. |
| Port 8765 is busy | Start Uvicorn on 8766. In PowerShell set `$env:HOOKFORGE_BASE_URL='http://127.0.0.1:8766'`; in macOS/Linux run `export HOOKFORGE_BASE_URL=http://127.0.0.1:8766`. Run the health example again. |
| Cannot find `ts/dist/HookforgeSDK.js` | Run the test/build command from step 2 successfully before running examples. |
| Windows reports `rm` is not recognized | Use the explicit Git Bash command in step 2; adjust its path if Git is installed elsewhere. |
| 422 response | Inspect the input schema at `/docs`. For example, `duplicate_count` must be between 1 and 100. |

Stop the API with Ctrl+C when finished. Never expose this teaching API publicly as a production webhook receiver.
