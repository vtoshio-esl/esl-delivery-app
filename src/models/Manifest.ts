import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";

export const ManifestModel = types
    .model('Manifest')
    .props({
        id: types.optional(types.identifierNumber, 0),
        sequence_code: types.optional(types.number, 0),
        vehicle_license_plate: types.optional(types.string, '') ,
        service_date: types.optional(types.string, ''),
        manifest_type: types.optional(
            types.enumeration(['fractionated_cargo', 'closed_cargo']),
            'fractionated_cargo'
        ),
        mobile_comments: types.optional(types.string, ''),
        mobile_type: types.optional(
            types.enumeration(['freight', 'invoice']), 
            'freight'
        ),
        has_operational_checklist_items: types.optional(types.boolean, false),

        // Parametrizacoes
        required_operational_checklist: types.optional(types.boolean, false),
        vehicle_check_temperature: types.optional(types.boolean, false),

        // Dados das Invoices
        invoices_volumes: types.optional(types.number, 0),
        invoices_weight: types.optional(types.string, ''),
        
        // Dados dos Items do Manifesto
        manifest_items_count: types.optional(types.number, 0),
        pending_items_count: types.optional(types.number, 0),
        delivery_manifest_items_count: types.optional(types.number, 0),
        transfer_manifest_items_count: types.optional(types.number, 0),
        pick_manifest_items_count: types.optional(types.number, 0),
        reverse_pick_manifest_items_count: types.optional(types.number, 0),
        consolidation_manifest_items_count: types.optional(types.number, 0),
        scheduling_operation_manifest_items_count: types.optional(types.number, 0),
        occurrence_items_count_total: types.optional(types.number, 0),

        // KM Saída e Início
        vehicle_departure_km: types.optional(types.number, 0),
        closing_km: types.optional(types.number, 0),

        // Datas
        departured_at: types.maybeNull(types.string),
        mobile_read_at: types.maybeNull(types.string),
        mobile_accepted_at: types.maybeNull(types.string),
    })

export interface Manifest extends Instance<typeof ManifestModel> {};
export interface ManifestSnapshotIn extends SnapshotIn<typeof ManifestModel> {};
export interface ManifestSnapshotOut extends SnapshotOut<typeof ManifestModel> {};