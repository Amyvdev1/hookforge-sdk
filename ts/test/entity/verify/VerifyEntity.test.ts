

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { HookforgeSDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('VerifyEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when HOOKFORGE_TEST_LIVE=TRUE.
  afterEach(liveDelay('HOOKFORGE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = HookforgeSDK.test()
    const ent = testsdk.Verify()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.HOOKFORGE_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'verify.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"payload":{"a":true,"h":"Payload","n":"payload","r":true,"t":"`$OBJECT`","key$":"payload","index$":0},"secret":{"a":true,"h":"Secret","n":"secret","r":false,"t":"`$STRING`","key$":"secret","index$":1},"signature":{"a":true,"h":"Signature","n":"signature","r":false,"t":"`$ANY`","key$":"signature","index$":2},"timestamp":{"a":true,"h":"Timestamp","n":"timestamp","r":true,"t":"`$INTEGER`","key$":"timestamp","index$":3}},"name":"verify","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /api/verify","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/api/verify","q":{},"r":{},"s":[{"lit":"api"},{"lit":"verify"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"verify","name__orig":"verify","Name":"Verify","name_":"verify","name-":"verify","NAME":"VERIFY","index$":5}, {"active":true,"entity":"verify","key$":"BasicVerifyFlow","kind":"basic","name":"BasicVerifyFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"verify_ref01"},"m":{},"o":"create","s":[],"v":[]}]}, 'Verify', {"POST /api/verify":{"protocol":"http","requestBody":{"content":{"application/json":{"schema":{"properties":{"secret":{"type":"string","title":"Secret","default":"demo-secret","key$":"secret"},"timestamp":{"type":"integer","title":"Timestamp","key$":"timestamp"},"payload":{"additionalProperties":true,"type":"object","title":"Payload","key$":"payload"},"signature":{"anyOf":[{"type":"string"},{"type":"null"}],"title":"Signature","key$":"signature"}},"type":"object","required":["timestamp","payload"],"title":"SignaturePayload","x-ref":"#/components/schemas/SignaturePayload","index$":1}}},"required":true},"parameters":[]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const verify_ref01_ent = client.Verify()
    let verify_ref01_data = setup.data.new.verify['verify_ref01']

    verify_ref01_data = (await verify_ref01_ent.create(verify_ref01_data)).data()
    assert(null != verify_ref01_data)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/verify/VerifyTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = HookforgeSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['verify01','verify02','verify03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'HOOKFORGE_TEST_VERIFY_ENTID': idmap,
    'HOOKFORGE_TEST_LIVE': 'FALSE',
    'HOOKFORGE_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['HOOKFORGE_TEST_VERIFY_ENTID']

  const live = 'TRUE' === env.HOOKFORGE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['HOOKFORGE_TEST_VERIFY_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new HookforgeSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.HOOKFORGE_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
