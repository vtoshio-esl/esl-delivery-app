import { Instance, types } from "mobx-state-tree";
import { PersonModel } from "../Person";
import { formatDateTimeToLocale } from "../../helpers/dateFormat";

export interface ManifestServiceContract<K extends string = string> {
    readonly kind: K;
    readonly resourceRoute: string;
}

export const ManifestServiceBaseModel = types
    .model('ManifestServiceBase')
    .props({
        position: types.optional(types.number, 0),
        comments: types.maybeNull(types.string),
        arrived_at: types.maybeNull(types.string),
        exited_at: types.maybeNull(types.string),
        recipient: types.maybeNull(PersonModel),

        occurrence_id: types.maybeNull(types.number),
        occurrence_at: types.maybeNull(types.string),
        receiver: types.maybeNull(types.string),
        document_number: types.maybeNull(types.string),
    })
    .views((self) => ({
        get hasOccurrence() {
            return !!self.occurrence_id;
        },
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
        }
    }))

export interface ManifestServiceBase extends Instance<typeof ManifestServiceBaseModel>{};