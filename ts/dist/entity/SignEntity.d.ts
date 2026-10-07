import { HookforgeEntityBase } from '../HookforgeEntityBase';
import type { HookforgeSDK } from '../HookforgeSDK';
import type { Control } from '../types';
import type { Sign, SignCreateData } from '../HookforgeTypes';
declare class SignEntity extends HookforgeEntityBase<Sign> {
    constructor(client: HookforgeSDK, entopts: any);
    make(this: SignEntity): SignEntity;
    create(this: any, reqdata?: SignCreateData, ctrl?: Control): Promise<SignEntity>;
}
export { SignEntity };
