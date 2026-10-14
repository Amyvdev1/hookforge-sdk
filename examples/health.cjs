const { HookforgeSDK } = require('../ts/dist/HookforgeSDK.js');
const client = new HookforgeSDK({ base: process.env.HOOKFORGE_BASE_URL || 'http://127.0.0.1:8765' });
client.Health().load()
  .then(result => console.log(JSON.stringify(result.data(), null, 2)))
  .catch(error => { console.error(error.message); process.exitCode = 1; });
