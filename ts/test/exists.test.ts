
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { HookforgeSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = HookforgeSDK.test()
    equal(testsdk instanceof HookforgeSDK, true,
      'HookforgeSDK.test() must return a client synchronously')
  })

})
