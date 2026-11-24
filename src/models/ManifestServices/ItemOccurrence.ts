import { types } from "mobx-state-tree";
import { OccurrenceModel } from "../Occurrence";
import { FINISHER_TRIGGERS } from "../types/OccurrenceTrigger";

export const ItemOccurrenceModel = types
    .model('ItemOccurrence')
    .props({
        id: types.identifierNumber,
        mobile_uuid: types.maybeNull(types.string),

        occurrence_id: types.optional(types.number, 0),
        occurrence_at: types.maybeNull(types.string),
        trigger: types.maybeNull(types.string),
        occurrence: types.optional(OccurrenceModel, {}),

        receiver: types.maybeNull(types.string),
        document_number: types.maybeNull(types.string),
        comments: types.maybeNull(types.string),
    })
    .views((self) => ({
        get isFinisher() {
            const t = self.trigger ?? self.occurrence?.trigger;
            return (FINISHER_TRIGGERS as readonly string[]).includes(t ?? '')
        }
    }))