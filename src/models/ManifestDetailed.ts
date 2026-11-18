import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";

import { ManifestModel } from "./Manifest";
import { ManifestItemModel } from "./ManifestServices/ManifestItem";
import { UnloadingRecipientModel } from "./ManifestServices/UnloadingRecipient";
import { ManifestService, ManifestServiceKind } from "./ManifestServices/types";

export const ManifestDetailedModel = ManifestModel
    .named('ManifestDetailed')
    .props({
        unloading_recipients: types.optional(
            types.array(UnloadingRecipientModel),
            []
        ),
        transfer_manifest_items: types.optional(
            types.array(ManifestItemModel), 
            []
        ),
        delivery_manifest_items: types.optional(
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
        get allManifestItems(): ManifestService[] {
            return [
                ...self.unloading_recipients,
                ...self.delivery_manifest_items,
                ...self.transfer_manifest_items,
                ...self.pick_manifest_items,
                ...self.reverse_pick_manifest_items,
                ...self.dispatch_draft_manifest_items,
                ...self.consolidation_manifest_items,
            ].sort((a, b) => 
                Number(a.hasOccurrence) - Number(b.hasOccurrence) ||
                a.position - b.position
            );
        },
        getServiceById(id: number, kind: ManifestServiceKind) {
            return this.allManifestItems.find((s) => s.kind === kind && s.id === id) 
        }
    }))

export interface ManifestDetailed extends Instance<typeof ManifestDetailedModel>{};
export interface ManifestDetailedSnapshotIn extends SnapshotIn<typeof ManifestDetailedModel>{};
export interface ManifestDetailedSnapshotOut extends SnapshotOut<typeof ManifestDetailedModel>{};
