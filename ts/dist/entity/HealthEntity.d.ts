import { HookforgeEntityBase } from '../HookforgeEntityBase';
import type { HookforgeSDK } from '../HookforgeSDK';
import type { Control } from '../types';
import type { Health, HealthLoadMatch } from '../HookforgeTypes';
declare class HealthEntity extends HookforgeEntityBase<Health> {
    constructor(client: HookforgeSDK, entopts: any);
    make(this: HealthEntity): HealthEntity;
    load(this: any, reqmatch?: HealthLoadMatch, ctrl?: Control): Promise<HealthEntity>;
}
export { HealthEntity };
