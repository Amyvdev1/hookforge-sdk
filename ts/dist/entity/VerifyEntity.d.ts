import { HookforgeEntityBase } from '../HookforgeEntityBase';
import type { HookforgeSDK } from '../HookforgeSDK';
import type { Control } from '../types';
import type { Verify, VerifyCreateData } from '../HookforgeTypes';
declare class VerifyEntity extends HookforgeEntityBase<Verify> {
    constructor(client: HookforgeSDK, entopts: any);
    make(this: VerifyEntity): VerifyEntity;
    create(this: any, reqdata?: VerifyCreateData, ctrl?: Control): Promise<VerifyEntity>;
}
export { VerifyEntity };
