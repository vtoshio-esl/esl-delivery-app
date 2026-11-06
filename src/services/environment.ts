import { Api } from "./api/base";

import { UserApi } from "./api/userApi";
import { OccurrencesApi } from "./api/occurrencesApi";
import { ManifestApi } from "./api/manifestApi";

export interface Environment {
    api: Api,
    userApi: UserApi,
    occurrencesApi: OccurrencesApi,
    manifestApi: ManifestApi
};

export const createEnvironment = (): Environment => {
    const api = new Api({ tenant: '' })
    
    return { 
        api: api, 
        userApi: new UserApi(api),
        occurrencesApi: new OccurrencesApi(api),
        manifestApi: new ManifestApi(api),
    }
};