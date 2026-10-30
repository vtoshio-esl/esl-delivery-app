import { Api } from "./api/base";
import { UserApi } from "./api/userApi";

export interface Environment {
    api: Api,
    userApi: UserApi
};

export const createEnvironment = (): Environment => {
    const api = new Api({ tenant: '' })
    
    return { 
        api: api, 
        userApi: new UserApi(api),
    }
};