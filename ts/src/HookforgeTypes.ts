// Typed models for the Hookforge SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields{} and per-op
// params (op.<name>.points[].g.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Capability {
}

export interface CapabilityLoadMatch {
}

export interface Evaluate {
  capabilities?: Record<string, any>
  scenario?: Record<string, any>
}

export interface EvaluateCreateData {
  capabilities?: Record<string, any>
  scenario?: Record<string, any>
}

export interface Health {
}

export interface HealthLoadMatch {
}

export interface Sign {
  payload: Record<string, any>
  secret?: string
  signature?: any
  timestamp: number
}

export interface SignCreateData {
  payload: Record<string, any>
  secret?: string
  signature?: any
  timestamp: number
}

export interface Simulate {
  capabilities?: Record<string, any>
  scenario?: Record<string, any>
}

export interface SimulateCreateData {
  capabilities?: Record<string, any>
  scenario?: Record<string, any>
}

export interface Verify {
  payload: Record<string, any>
  secret?: string
  signature?: any
  timestamp: number
}

export interface VerifyCreateData {
  payload: Record<string, any>
  secret?: string
  signature?: any
  timestamp: number
}

