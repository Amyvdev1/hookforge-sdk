import { CapabilityEntity } from './entity/CapabilityEntity';
import { EvaluateEntity } from './entity/EvaluateEntity';
import { HealthEntity } from './entity/HealthEntity';
import { SignEntity } from './entity/SignEntity';
import { SimulateEntity } from './entity/SimulateEntity';
import { VerifyEntity } from './entity/VerifyEntity';
export type * from './HookforgeTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { HookforgeEntityBase } from './HookforgeEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
declare class HookforgeSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<Error | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    } | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    }>;
    _rawRequest(fetchargs?: any): Promise<Error | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    } | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    }>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Capability(entopts?: Record<string, any>): CapabilityEntity;
    Evaluate(entopts?: Record<string, any>): EvaluateEntity;
    Health(entopts?: Record<string, any>): HealthEntity;
    Sign(entopts?: Record<string, any>): SignEntity;
    Simulate(entopts?: Record<string, any>): SimulateEntity;
    Verify(entopts?: Record<string, any>): VerifyEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): HookforgeSDK;
    tester(testopts?: any, sdkopts?: any): HookforgeSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof HookforgeSDK;
export { stdutil, config, BaseFeature, HookforgeEntityBase, HookforgeSDK, SDK, };
