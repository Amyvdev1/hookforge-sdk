const { HookforgeSDK } = require('../ts/dist/HookforgeSDK.js');
const client = new HookforgeSDK({base:process.env.HOOKFORGE_BASE_URL || 'http://127.0.0.1:8765'});
(async () => {
  const result = await client.Simulate().create({
    capabilities: {duplicate_protection:true, event_ordering:true},
    scenario: {duplicate_count:3, out_of_order:true}
  });
  console.log(JSON.stringify(result.data(), null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
