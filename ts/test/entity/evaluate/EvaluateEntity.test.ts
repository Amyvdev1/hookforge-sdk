

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


describe('EvaluateEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when HOOKFORGE_TEST_LIVE=TRUE.
  afterEach(liveDelay('HOOKFORGE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = HookforgeSDK.test()
    const ent = testsdk.Evaluate()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.HOOKFORGE_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'evaluate.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"capabilities":{"a":true,"h":"Capabilities","n":"capabilities","r":false,"t":"`$OBJECT`","key$":"capabilities","index$":0},"scenario":{"a":true,"h":"Scenario","n":"scenario","r":false,"t":"`$OBJECT`","key$":"scenario","index$":1}},"name":"evaluate","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /api/evaluate","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/api/evaluate","q":{},"r":{},"s":[{"lit":"api"},{"lit":"evaluate"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"evaluate","name__orig":"evaluate","Name":"Evaluate","name_":"evaluate","name-":"evaluate","NAME":"EVALUATE","index$":1}, {"active":true,"entity":"evaluate","key$":"BasicEvaluateFlow","kind":"basic","name":"BasicEvaluateFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"evaluate_ref01"},"m":{},"o":"create","s":[],"v":[]}]}, 'Evaluate', {"POST /api/evaluate":{"protocol":"http","requestBody":{"content":{"application/json":{"schema":{"properties":{"capabilities":{"additionalProperties":{"type":"boolean"},"type":"object","title":"Capabilities","key$":"capabilities"},"scenario":{"properties":{"duplicate_count":{"type":"integer","maximum":100,"minimum":1,"title":"Duplicate Count","default":1},"delay_seconds":{"type":"integer","maximum":3600,"minimum":0,"title":"Delay Seconds","default":0},"out_of_order":{"type":"boolean","title":"Out Of Order","default":false},"valid_signature":{"type":"boolean","title":"Valid Signature","default":true},"retry_count":{"type":"integer","maximum":100,"minimum":0,"title":"Retry Count","default":0},"timeout_ms":{"type":"integer","maximum":60000,"minimum":0,"title":"Timeout Ms","default":0},"malformed_payload":{"type":"boolean","title":"Malformed Payload","default":false},"unknown_event_type":{"type":"boolean","title":"Unknown Event Type","default":false}},"additionalProperties":false,"type":"object","title":"ScenarioInput","x-ref":"#/components/schemas/ScenarioInput","key$":"scenario"}},"type":"object","title":"Evaluation","x-ref":"#/components/schemas/Evaluation","index$":1}}},"required":true},"parameters":[]}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const evaluate_ref01_ent = client.Evaluate()
    let evaluate_ref01_data = setup.data.new.evaluate['evaluate_ref01']

    evaluate_ref01_data = (await evaluate_ref01_ent.create(evaluate_ref01_data)).data()
    assert(null != evaluate_ref01_data)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/evaluate/EvaluateTestData.json')

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
    ['evaluate01','evaluate02','evaluate03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'HOOKFORGE_TEST_EVALUATE_ENTID': idmap,
    'HOOKFORGE_TEST_LIVE': 'FALSE',
    'HOOKFORGE_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['HOOKFORGE_TEST_EVALUATE_ENTID']

  const live = 'TRUE' === env.HOOKFORGE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['HOOKFORGE_TEST_EVALUATE_ENTID']
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
  
