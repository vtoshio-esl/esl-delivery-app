import { AxiosRequestConfig } from "axios";
import { DriverSnapshotIn } from "../../models/Driver";
import { Api } from "./base";

export interface LoginResponse {
    token: string
}

export class UserApi {
    api: Api;

    constructor (api: Api) {
        this.api = api;
    }

    async login(email: string, password: string): Promise<LoginResponse> {
        const response = await this.api.client.post(
            '/drivers/sign_in.json',
            { driver: { email: email, password: password } },
            { skipUnauthorizedHandler: true }
        )

        return response.data;
    }

    async fetchDriverData(config?: AxiosRequestConfig): Promise<DriverSnapshotIn> {
        const { data } = await this.api.client.get('/api/driver/data', config)

        return data;
    }
}