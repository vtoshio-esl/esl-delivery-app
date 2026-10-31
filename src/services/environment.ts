import { Api } from "./api/base";
import { OccurrencesApi } from "./api/occurrencesApi";
import { UserApi } from "./api/userApi";

export interface Environment {
    api: Api,
    userApi: UserApi,
    occurrencesApi: OccurrencesApi
};

export const createEnvironment = (): Environment => {
    const api = new Api({ tenant: '' })
    
    return { 
        api: api, 
        userApi: new UserApi(api),
        occurrencesApi: new OccurrencesApi(api),
    }
};