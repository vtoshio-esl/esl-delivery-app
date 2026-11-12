import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";
import { formatDateToLocale, formatTimeToInterval } from "../helpers/dateFormat";
import { PickItemModel } from "./PickItem";

export const PickModel = types
    .model('Pick')
    .props({
        id: types.optional(types.identifierNumber, 0),
        sequence_code: types.maybeNull(types.number),
        contact_name: types.maybeNull(types.string),
        mobile_comments: types.maybeNull(types.string),
        invoices_volumes: types.optional(types.number, 0),

        service_date: types.optional(types.string, ''),
        service_start_hour: types.maybeNull(types.string),
        service_end_hour: types.maybeNull(types.string),
        lunch_break_start_hour: types.maybeNull(types.string),
        lunch_break_end_hour: types.maybeNull(types.string),

        pick_items: types.optional(types.array(PickItemModel), []),
        pick_mailbag_items: types.optional(types.array(PickItemModel), [])
    })
    .views((self) => ({
        get serviceDateFormatted() {
            return formatDateToLocale(self.service_date);
        },
        get pickAtInterval() {
            if (!self.service_start_hour || !self.service_end_hour)
                return null;
            
            return formatTimeToInterval(self.service_start_hour, self.service_end_hour)
        },
        get lunchAtInterval() {
            if (!self.lunch_break_start_hour || !self.lunch_break_end_hour)
                return null;
            
            return formatTimeToInterval(self.lunch_break_start_hour, self.lunch_break_end_hour);
        }
    }))

export interface Pick extends Instance<typeof PickItemModel>{};