import { HookforgeEntityBase } from '../HookforgeEntityBase';
import type { HookforgeSDK } from '../HookforgeSDK';
import type { Control } from '../types';
import type { Capability, CapabilityLoadMatch } from '../HookforgeTypes';
declare class CapabilityEntity extends HookforgeEntityBase<Capability> {
    constructor(client: HookforgeSDK, entopts: any);
    make(this: CapabilityEntity): CapabilityEntity;
    load(this: any, reqmatch?: CapabilityLoadMatch, ctrl?: Control): Promise<CapabilityEntity>;
}
export { CapabilityEntity };
