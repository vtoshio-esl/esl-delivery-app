import { OccurrenceSnapshotIn } from "../../models/Occurrence";
import { Api } from "./base";

export class OccurrencesApi {
    api: Api

    constructor(api: Api) {
        this.api = api;
    }

    async fetchOccurrences(): Promise<OccurrenceSnapshotIn[]> {
        const { data } = await this.api.client.get('/api/occurrences');

        return data;
    }
}