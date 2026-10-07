import { HookforgeEntityBase } from '../HookforgeEntityBase';
import type { HookforgeSDK } from '../HookforgeSDK';
import type { Control } from '../types';
import type { Simulate, SimulateCreateData } from '../HookforgeTypes';
declare class SimulateEntity extends HookforgeEntityBase<Simulate> {
    constructor(client: HookforgeSDK, entopts: any);
    make(this: SimulateEntity): SimulateEntity;
    create(this: any, reqdata?: SimulateCreateData, ctrl?: Control): Promise<SimulateEntity>;
}
export { SimulateEntity };
