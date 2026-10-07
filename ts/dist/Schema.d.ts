declare const OPTSPEC: {
    allow: {
        method: string;
        op: string;
    };
    apikey: string;
    auth: {
        basic: boolean;
        in: string;
        name: string;
        prefix: string;
    };
    base: string;
    clean: {
        active: boolean;
        hint: string;
        keys: string;
        mask: string;
        min: string;
        values: string;
    };
    entity: {
        "`$CHILD`": {
            "`$OPEN`": boolean;
            active: boolean;
            alias: {};
        };
    };
    extend: string;
    headers: {
        "`$CHILD`": string;
    };
    prefix: string;
    secret: string;
    server: {
        "`$CHILD`": string;
    };
    suffix: string;
    system: {
        fetch: string;
    };
    test: {
        active: boolean;
        entity: {
            "`$OPEN`": boolean;
        };
    };
    utility: {};
    feature: {
        "`$CHILD`": {
            "`$OPEN`": boolean;
            active: boolean;
        };
        test: (string | {
            "`$OPEN`": boolean;
            active: string[];
            entity: string[];
            net: string[];
        })[];
    };
};
declare const ENTITYSPEC: {};
export { OPTSPEC, ENTITYSPEC, };
