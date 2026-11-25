import { getEnv, types } from "mobx-state-tree";
import { uuid } from "expo";

export const EventModel = types
    .model('Events')
    .props({
        id: types.identifier,
        service_key: types.string,
        occurrence_id: types.number,
        occurrence_at: types.string,
        description: types.string,
        comments: types.optional(types.string, ''),
    })