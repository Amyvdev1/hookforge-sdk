// Exercise the exact files readers run, against the local API used by CI.
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
function example(name) {
  return JSON.parse(execFileSync(process.execPath, [path.join(__dirname, '..', 'examples', name)], { encoding: 'utf8' }));
}
assert.equal(example('health.cjs').service, 'hookforge');
const duplicate = example('duplicate-delivery.cjs');
assert.equal(duplicate.deliveries.filter(item => item.accepted).length, 2);
assert.equal(duplicate.deliveries.filter(item => item.duplicate).length, 2);
const ordering = example('out-of-order.cjs');
assert.equal(ordering.deliveries.filter(item => item.accepted).length, 1);
assert.equal(ordering.deliveries[1].duplicate, false);
assert.match(ordering.deliveries[1].notes.join(' '), /stale/);
console.log('PASS: all three quickstart examples match their documented outcomes');
