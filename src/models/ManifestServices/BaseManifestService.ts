import { Instance, types } from "mobx-state-tree";
import { PersonModel } from "../Person";
import { formatDateTimeToLocale } from "../../helpers/dateFormat";
import { ItemOccurrenceModel } from "./ItemOccurrence";

export interface ManifestServiceContract<K extends string = string> {
    readonly kind: K;
    readonly resourceRoute: string;
    readonly canRegisterExit: boolean;
    readonly canRegisterEvent: boolean;
}

export const ManifestServiceBaseModel = types
    .model('ManifestServiceBase')
    .props({
        position: types.optional(types.number, 0),
        comments: types.maybeNull(types.string),
        arrived_at: types.maybeNull(types.string),
        exited_at: types.maybeNull(types.string),
        recipient: types.maybeNull(PersonModel),

        item_occurrences: types.optional(types.array(ItemOccurrenceModel), []),
        occurrence_id: types.maybeNull(types.number),
        occurrence_at: types.maybeNull(types.string),
        receiver: types.maybeNull(types.string),
        document_number: types.maybeNull(types.string),
    })
    .views((self) => ({
        get hasArrived() {
            return !!self.arrived_at;
        },
        get hasExited() {
            return !!self.exited_at;
        },
        get formattedArrivedAt() {
            if (!self.arrived_at) return null;

            return formatDateTimeToLocale(self.arrived_at);
        },
        get formattedExitedAt() {
            if (!self.exited_at) return null;

            return formatDateTimeToLocale(self.exited_at)
        },
        get finisherItemOccurrence() {
            return [...self.item_occurrences]
                .filter((io) => io.isFinisher)
                .sort((a, b) => (b.occurrence_at ?? '').localeCompare(a.occurrence_at ?? ''))[0];
        }
    }))
    .views((self) => ({
        get effectiveOccurrence() {
            if (self.occurrence_id) {
                return {
                    occurrence_id: self.occurrence_id,
                    occurrence_at: self.occurrence_at,
                    receiver: self.receiver,
                    document_number: self.document_number,
                    comments: self.comments,
                }
            }
            return self.finisherItemOccurrence ?? null;
        },
        get hasOccurrence() {
            return !!self.occurrence_id || !!self.finisherItemOccurrence;
        }
    }))

export interface ManifestServiceBase extends Instance<typeof ManifestServiceBaseModel>{};