const assert = require('node:assert/strict');
const { HookforgeSDK } = require('../ts/dist/HookforgeSDK.js');
const base = process.env.HOOKFORGE_BASE_URL || 'http://127.0.0.1:8765';
const client = new HookforgeSDK({ base });
let passed = 0;
async function check(name, fn) {
  await fn();
  passed++;
  console.log(`PASS ${name}`);
}
(async () => {
  await check('GET /health: real service identity', async () => {
    const result = (await client.Health().load()).data();
    assert.equal(result.status, 'ok'); assert.equal(result.service, 'hookforge');
  });
  await check('GET /api/capabilities: nine capabilities', async () => {
    const result = (await client.Capability().load()).data();
    assert.equal(Object.keys(result.capabilities).length, 9);
  });
  await check('POST /api/evaluate: complete receiver scores 100', async () => {
    const caps = (await client.Capability().load()).data().capabilities;
    const result = (await client.Evaluate().create({capabilities: Object.fromEntries(Object.keys(caps).map(k => [k, true])), scenario: {}})).data();
    assert.equal(result.resilience_score, 100);
  });
  await check('POST /api/simulate: duplicate events rejected', async () => {
    const result = (await client.Simulate().create({capabilities:{duplicate_protection:true}, scenario:{duplicate_count:3}})).data();
    assert.equal(result.deliveries.filter(d => d.duplicate).length, 2);
    assert.equal(result.deliveries.filter(d => d.accepted).length, 2);
  });
  const request = {secret:'public-test-fixture-not-a-credential', timestamp:1700000000, payload:{id:'evt_sdk_test'}};
  let signature;
  await check('POST /api/sign: HMAC output', async () => {
    signature = (await client.Sign().create(request)).data().signature;
    assert.match(signature, /^[0-9a-f]{64}$/);
  });
  await check('POST /api/verify: matching payload accepted', async () => {
    assert.equal((await client.Verify().create({...request, signature})).data().valid, true);
  });
  await check('POST /api/verify: tampered payload rejected', async () => {
    assert.equal((await client.Verify().create({...request, signature, payload:{id:'tampered'}})).data().valid, false);
  });
  await check('POST /api/simulate: invalid input throws', async () => {
    await assert.rejects(() => client.Simulate().create({scenario:{duplicate_count:0}}), /422/);
  });
  console.log(JSON.stringify({passed, base, transport:'real HTTP, not SDK mock mode'}));
})().catch(error => { console.error(error); process.exitCode = 1; });
