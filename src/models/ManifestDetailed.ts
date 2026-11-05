import { types, SnapshotIn, SnapshotOut, Instance, cast } from "mobx-state-tree";

import { ManifestModel } from "./Manifest";
import { ManifestItemModel, ManifestItemSnapshotIn } from "./ManifestItem";

export const ManifestDetailedModel = ManifestModel
    .named('ManifestDetailed')
    .props({
        delivery_manifest_items: types.optional(
            types.array(ManifestItemModel), 
            []
        ),
        transfer_manifest_items: types.optional(
            types.array(ManifestItemModel), 
            []
        ),
        pick_manifest_items: types.optional(
            types.array(ManifestItemModel), 
            []
        ),
        reverse_pick_manifest_items: types.optional(
            types.array(ManifestItemModel), 
            []
        ),
        dispatch_draft_manifest_items: types.optional(
            types.array(ManifestItemModel), 
            []
        ),
        consolidation_manifest_items: types.optional(
            types.array(ManifestItemModel), 
            []
        ),
    })
    .views((self) => ({
        get allManifestItems() {
            return [
                ...self.delivery_manifest_items,
                ...self.transfer_manifest_items,
                ...self.pick_manifest_items,
                ...self.reverse_pick_manifest_items,
                ...self.dispatch_draft_manifest_items,
                ...self.consolidation_manifest_items
            ].sort((item) => item.position);
        }
    }))
    

export interface ManifestDetailed extends Instance<typeof ManifestDetailedModel>{};
export interface ManifestDetailedSnapshotIn extends SnapshotIn<typeof ManifestDetailedModel>{};
export interface ManifestDetailedSnapshotOut extends SnapshotOut<typeof ManifestDetailedModel>{};
