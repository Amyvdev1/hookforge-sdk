"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('SignEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when HOOKFORGE_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('HOOKFORGE_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.HookforgeSDK.test();
        const ent = testsdk.Sign();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.HOOKFORGE_TEST_LIVE;
        for (const op of ['create']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'sign.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "payload": { "a": true, "h": "Payload", "n": "payload", "r": true, "t": "`$OBJECT`", "key$": "payload", "index$": 0 }, "secret": { "a": true, "h": "Secret", "n": "secret", "r": false, "t": "`$STRING`", "key$": "secret", "index$": 1 }, "signature": { "a": true, "h": "Signature", "n": "signature", "r": false, "t": "`$ANY`", "key$": "signature", "index$": 2 }, "timestamp": { "a": true, "h": "Timestamp", "n": "timestamp", "r": true, "t": "`$INTEGER`", "key$": "timestamp", "index$": 3 } }, "name": "sign", "op": { "create": { "input": "data", "name": "create", "points": [{ "a": true, "co": { "id": "POST /api/sign", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "m": "POST", "o": "/api/sign", "q": {}, "r": {}, "s": [{ "lit": "api" }, { "lit": "sign" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "create" } }, "relations": { "ancestors": [] }, "key$": "sign", "name__orig": "sign", "Name": "Sign", "name_": "sign", "name-": "sign", "NAME": "SIGN", "index$": 3 }, { "active": true, "entity": "sign", "key$": "BasicSignFlow", "kind": "basic", "name": "BasicSignFlow", "param": {}, "step": [{ "a": true, "d": {}, "i": { "ref": "sign_ref01" }, "m": {}, "o": "create", "s": [], "v": [] }] }, 'Sign', { "POST /api/sign": { "protocol": "http", "requestBody": { "content": { "application/json": { "schema": { "properties": { "secret": { "type": "string", "title": "Secret", "default": "demo-secret", "key$": "secret" }, "timestamp": { "type": "integer", "title": "Timestamp", "key$": "timestamp" }, "payload": { "additionalProperties": true, "type": "object", "title": "Payload", "key$": "payload" }, "signature": { "anyOf": [{ "type": "string" }, { "type": "null" }], "title": "Signature", "key$": "signature" } }, "type": "object", "required": ["timestamp", "payload"], "title": "SignaturePayload", "x-ref": "#/components/schemas/SignaturePayload", "index$": 1 } } }, "required": true }, "parameters": [] } });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        // CREATE
        const sign_ref01_ent = client.Sign();
        let sign_ref01_data = setup.data.new.sign['sign_ref01'];
        sign_ref01_data = (await sign_ref01_ent.create(sign_ref01_data)).data();
        (0, node_assert_1.default)(null != sign_ref01_data);
    });
});
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/sign/SignTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.HookforgeSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['sign01', 'sign02', 'sign03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'HOOKFORGE_TEST_SIGN_ENTID': idmap,
        'HOOKFORGE_TEST_LIVE': 'FALSE',
        'HOOKFORGE_TEST_EXPLAIN': 'FALSE',
    });
    idmap = env['HOOKFORGE_TEST_SIGN_ENTID'];
    const live = 'TRUE' === env.HOOKFORGE_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['HOOKFORGE_TEST_SIGN_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.HookforgeSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {},
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
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
    };
    return setup;
}
//# sourceMappingURL=SignEntity.test.js.map