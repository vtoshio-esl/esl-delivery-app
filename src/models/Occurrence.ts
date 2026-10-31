import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";

export const OccurrenceModel = types
    .model('Occurrence')
    .props({
        id: types.optional(types.identifierNumber, 0),
        code: types.optional(types.number, 0),
        description: types.optional(types.string, ''),
        trigger: types.optional(types.string, 'nothing'),
        active: types.optional(types.boolean, true),
        available_for: types.optional(types.array(types.string), []),
        
        closes_performance: types.optional(types.boolean, true),
        requires_photo_on_mobile: types.optional(types.boolean, true),
        require_receiver: types.optional(types.boolean, true)
    })

export interface Occurrence extends Instance<typeof OccurrenceModel> {};
export interface OccurrenceSnapshotIn extends SnapshotIn<typeof OccurrenceModel> {};
export interface OccurrenceSnapshotOut extends SnapshotOut<typeof OccurrenceModel> {};
export const createDefaultOccurrenceModel = () => types.optional(OccurrenceModel, {});