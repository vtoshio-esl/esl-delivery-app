import { getEnv, Instance, types } from "mobx-state-tree";
import { Environment } from "../services/environment";
import { DriverSnapshotIn, DriverModel } from "../models/Driver";

interface Session {
    token: string,
    tenant: string,
    email: string,
    driver: DriverSnapshotIn
}

export const UserStoreModel = types
    .model('UserStore')
    .props({
        token: types.maybe(types.string),
        tenant: types.optional(types.string, ''),
        email: types.optional(types.string, ''),
        driver: types.maybe(DriverModel),
    })
    .views((self) => ({
        get isAuthenticated() {
            return !!self.token;
        },
        get corporation() {
            return self.driver?.corporation;
        }
    }))
    .actions((self) => ({
        syncApi() {
            const { api } = getEnv<Environment>(self);
            
            api.setTenant(self.tenant);
            api.setToken(self.token);
        },
        setSession(session: Session) {
            self.token = session.token
            self.tenant = session.tenant
            self.email = session.email
            self.driver = DriverModel.create(session.driver)
        },
        logout() {
            self.email = ''
            self.tenant = ''
            self.token = undefined;
            self.driver = undefined;

            this.syncApi();
        }
    }))
    .actions((self) => ({
        login: async (tenant: string, email: string, password: string) => {
            const { api, userApi } = getEnv<Environment>(self);
            
            try {
                api.setTenant(tenant);
                
                const { token } = await userApi.login(email, password);
                if (!token) throw new Error('Resposta de login sem token');
                
                api.setToken(token)

                const driver = await userApi.fetchDriverData();
                
                self.setSession({ token, tenant, email, driver });
            } catch (e) {
                self.syncApi();
                throw e;
            }
        }
    }));

export interface UserStore extends Instance<typeof UserStoreModel>{};
export const createDefaultUserStoreModel = () => types.optional(UserStoreModel, {});