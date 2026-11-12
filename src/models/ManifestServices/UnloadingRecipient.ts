import { types, Instance } from "mobx-state-tree";

import { ManifestServiceBaseModel, ManifestServiceContract } from "./BaseManifestService";

export const UnloadingRecipientModel = ManifestServiceBaseModel
    .named('UnloadingRecipient')
    .props({
        id: types.identifierNumber,
        manifest_id: types.maybeNull(types.number),
        occurrence_id: types.maybeNull(types.number),

        estimated_arrival_at: types.maybeNull(types.string),
        vehicle_arrival_km: types.optional(types.number, 0),
        comments: types.maybeNull(types.string),

        invoices_count: types.optional(types.number, 0),
        invoices_weight: types.maybeNull(types.string),
        invoices_value: types.maybeNull(types.string),
        freights_count: types.optional(types.number, 0),
        freights_volumes: types.optional(types.number, 0),
    })
    .views((self): ManifestServiceContract<'unloading_recipient'> => ({
        get kind() { return 'unloading_recipient' as const },
        get resourceRoute() { return 'unloading_recipients' as const},
    }))

export interface UnloadingRecipient extends Instance<typeof UnloadingRecipientModel>{};