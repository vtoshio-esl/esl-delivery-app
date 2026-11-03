import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";
import { FINISHER_TRIGGERS, getTriggerLabel, OccurrenceTrigger, TRIGGERS } from "./types/OccurrenceTrigger";
import { AVAILABLE_FOR_LABELS, AvailableFor, getAvailableForLabel } from "./types/OccurrenceAvailableFor";

export const OccurrenceModel = types
    .model('Occurrence')
    .props({
        id: types.optional(types.identifierNumber, 0),
        code: types.optional(types.number, 0),
        description: types.optional(types.string, ''),
        active: types.optional(types.boolean, true),
        trigger: types.optional(
            types.union(
                types.enumeration<OccurrenceTrigger>('Trigger', [...TRIGGERS]), 
                types.string
            ),
            'nothing'
        ),
        available_for: types.optional(
            types.array(
                types.enumeration<AvailableFor>(
                    'AvailableFor',
                    Object.keys(AVAILABLE_FOR_LABELS) as AvailableFor[]
                )
            ),
            []
        ),
        
        closes_performance: types.optional(types.boolean, true),
        requires_photo_on_mobile: types.optional(types.boolean, true),
        require_receiver: types.optional(types.boolean, true)
    })
    .views((self) => ({
        get triggerLabel(): string {
            return getTriggerLabel(self.trigger)
        },
        get isFinisher(): boolean {
            return (FINISHER_TRIGGERS as readonly string[]).includes(self.trigger);
        },
        get availableForLabel() {
            return self.available_for.map(getAvailableForLabel);
        },
        isAvailableFor(value: AvailableFor) {
            return self.available_for.includes(value);
        }
    }))

export interface Occurrence extends Instance<typeof OccurrenceModel> {};
export interface OccurrenceSnapshotIn extends SnapshotIn<typeof OccurrenceModel> {};
export interface OccurrenceSnapshotOut extends SnapshotOut<typeof OccurrenceModel> {};
export const createDefaultOccurrenceModel = () => types.optional(OccurrenceModel, {});