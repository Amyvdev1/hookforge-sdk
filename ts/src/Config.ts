
import { BaseFeature } from './feature/base/BaseFeature'
import { TestFeature } from './feature/test/TestFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   test: TestFeature,

}


const FEATURE_PLUGINS: Record<string, any[]> = {
  
}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'Hookforge',
        slug: "hookforge",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     test:     {
      "options": {
        "active": false
      },
      "optspec": {
        "entity": "`$MAP`",
        "net": "`$MAP`"
      },
      "strict": false,
      "transport": "base"
    },

  }


  options = {
    base: "http://127.0.0.1:8765",

    headers: {
      "content-type": "application/json"
    },

    entity: {
      
        capability: {
        },
  
        evaluate: {
        },
  
        health: {
        },
  
        sign: {
        },
  
        simulate: {
        },
  
        verify: {
        },
  
    }
  }


  entity = {
    "capability": {
      "fields": [],
      "name": "capability",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/api/capabilities",
              "segments": [
                {
                  "lit": "api"
                },
                {
                  "lit": "capabilities"
                }
              ],
              "parts": [
                "api",
                "capabilities"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {}
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "evaluate": {
      "fields": [
        {
          "name": "capabilities",
          "title": "Capabilities",
          "type": "`$OBJECT`"
        },
        {
          "name": "scenario",
          "title": "Scenario",
          "type": "`$OBJECT`"
        }
      ],
      "name": "evaluate",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/api/evaluate",
              "segments": [
                {
                  "lit": "api"
                },
                {
                  "lit": "evaluate"
                }
              ],
              "parts": [
                "api",
                "evaluate"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {}
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "health": {
      "fields": [],
      "name": "health",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "kind": "http",
              "method": "GET",
              "orig": "/health",
              "segments": [
                {
                  "lit": "health"
                }
              ],
              "parts": [
                "health"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {}
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "sign": {
      "fields": [
        {
          "name": "payload",
          "title": "Payload",
          "type": "`$OBJECT`",
          "req": true
        },
        {
          "name": "secret",
          "title": "Secret",
          "type": "`$STRING`"
        },
        {
          "name": "signature",
          "title": "Signature",
          "type": "`$ANY`"
        },
        {
          "name": "timestamp",
          "title": "Timestamp",
          "type": "`$INTEGER`",
          "req": true
        }
      ],
      "name": "sign",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/api/sign",
              "segments": [
                {
                  "lit": "api"
                },
                {
                  "lit": "sign"
                }
              ],
              "parts": [
                "api",
                "sign"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {}
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "simulate": {
      "fields": [
        {
          "name": "capabilities",
          "title": "Capabilities",
          "type": "`$OBJECT`"
        },
        {
          "name": "scenario",
          "title": "Scenario",
          "type": "`$OBJECT`"
        }
      ],
      "name": "simulate",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/api/simulate",
              "segments": [
                {
                  "lit": "api"
                },
                {
                  "lit": "simulate"
                }
              ],
              "parts": [
                "api",
                "simulate"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {}
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "verify": {
      "fields": [
        {
          "name": "payload",
          "title": "Payload",
          "type": "`$OBJECT`",
          "req": true
        },
        {
          "name": "secret",
          "title": "Secret",
          "type": "`$STRING`"
        },
        {
          "name": "signature",
          "title": "Signature",
          "type": "`$ANY`"
        },
        {
          "name": "timestamp",
          "title": "Timestamp",
          "type": "`$INTEGER`",
          "req": true
        }
      ],
      "name": "verify",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "kind": "http",
              "method": "POST",
              "orig": "/api/verify",
              "segments": [
                {
                  "lit": "api"
                },
                {
                  "lit": "verify"
                }
              ],
              "parts": [
                "api",
                "verify"
              ],
              "rename": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "args": {},
              "select": {}
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config,
  FEATURE_PLUGINS,
}

