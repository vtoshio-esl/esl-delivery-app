import { Api } from "./api/base";

import { UserApi } from "./api/userApi";
import { OccurrencesApi } from "./api/occurrencesApi";
import { ManifestApi } from "./api/manifestApi";
import { ManifestItemApi } from "./api/manifestItemApi";

export interface Environment {
    api: Api,
    userApi: UserApi,
    occurrencesApi: OccurrencesApi,
    manifestApi: ManifestApi,
    manifestItemApi: ManifestItemApi,
};

export const createEnvironment = (): Environment => {
    const api = new Api({ tenant: '' })
    
    return { 
        api: api, 
        userApi: new UserApi(api),
        occurrencesApi: new OccurrencesApi(api),
        manifestApi: new ManifestApi(api),
        manifestItemApi: new ManifestItemApi(api),
    }
};