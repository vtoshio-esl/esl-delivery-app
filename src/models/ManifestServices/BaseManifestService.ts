import { types } from "mobx-state-tree";
import { PersonModel } from "../Person";

export interface ManifestServiceContract<K extends string = string> {
    readonly kind: K,
    readonly resourceRoute: string,
}

export const ManifestServiceBaseModel = types
    .model('ManifestServiceBase')
    .props({
        position: types.optional(types.number, 0),
        comments: types.maybeNull(types.string),
        arrived_at: types.maybeNull(types.string),
        recipient: types.maybeNull(PersonModel)
    })
    .views((self) => ({
        get hasArrived() {
            return !!self.arrived_at
        }
    }))