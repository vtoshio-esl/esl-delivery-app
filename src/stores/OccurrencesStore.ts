import { cast, getEnv, types } from "mobx-state-tree";
import { Occurrence, OccurrenceModel, OccurrenceSnapshotIn } from "../models/Occurrence";
import { Environment } from "../services/environment";

export const OccurrencesStoreModel = types
    .model('OccurrencesStore')
    .props({
        occurrences: types.optional(types.array(OccurrenceModel), [])
    })
    .views((self) => ({
        get occurrencesForFinish(): Occurrence[] {
            return self.occurrences
                .filter((o) => o.isFinisher)
        },
        get occurrencesForDealing() : Occurrence[] {
            return self.occurrences
                .filter((o) => o.isDealing)
        },
        get occurrencesForEvents(): Occurrence[] {
            return self.occurrences
                .filter((o) => o.isEvent)
        },
        occurrenceFromId: (id: number | null): Occurrence | undefined => {
            if (!id) return;

            return self.occurrences.find((o) => o.id === id)
        }
    }))
    .actions((self) => ({
        setOccurrences: (occurrences: OccurrenceSnapshotIn[]) => {
            self.occurrences = cast(occurrences);
        },
        logout: () => {
            self.occurrences.clear();
        }
    }))
    .actions((self) => ({
        fetchOccurrences: async () => {
            const { occurrencesApi } = getEnv<Environment>(self);

            const occurrences = await occurrencesApi.fetchOccurrences();
            self.setOccurrences(occurrences);
        }
    }))