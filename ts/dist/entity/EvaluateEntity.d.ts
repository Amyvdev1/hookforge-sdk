import { HookforgeEntityBase } from '../HookforgeEntityBase';
import type { HookforgeSDK } from '../HookforgeSDK';
import type { Control } from '../types';
import type { Evaluate, EvaluateCreateData } from '../HookforgeTypes';
declare class EvaluateEntity extends HookforgeEntityBase<Evaluate> {
    constructor(client: HookforgeSDK, entopts: any);
    make(this: EvaluateEntity): EvaluateEntity;
    create(this: any, reqdata?: EvaluateCreateData, ctrl?: Control): Promise<EvaluateEntity>;
}
export { EvaluateEntity };
