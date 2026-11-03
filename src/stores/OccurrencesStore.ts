import { cast, getEnv, types } from "mobx-state-tree";
import { OccurrenceModel, OccurrenceSnapshotIn } from "../models/Occurrence";
import { Environment } from "../services/environment";

export const OccurrencesStoreModel = types
    .model('OccurrencesStore')
    .props({
        occurrences: types.optional(types.array(OccurrenceModel), [])
    })
    .actions((self) => ({
        setOccurrences: (occurrences: OccurrenceSnapshotIn[]) => {
            self.occurrences = cast(occurrences);
        }
    }))
    .actions((self) => ({
        fetchOccurrences: async () => {
            const { occurrencesApi } = getEnv<Environment>(self);

            const occurrences = await occurrencesApi.fetchOccurrences();
            self.setOccurrences(occurrences);
        }
    }))