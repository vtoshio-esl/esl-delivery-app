import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";
import { CorporationModel } from "./Corporation";

export const FreightModel = types
    .model('Freight')
    .props({
        id: types.optional(types.identifierNumber, 0),
        sequence_code: types.optional(types.number, 0),
        draft_number: types.maybeNull(types.number),
        cte_number: types.maybeNull(types.number),
        corporation: types.optional(CorporationModel, {}),
    })
    .views((self) => ({
        documentNumber: (): string => {
            let draftNumber = (self.draft_number) ? self.draft_number : '';
            let cteNumber = (self.cte_number) ? self.cte_number : '';
            
            return `${draftNumber}/${cteNumber}` 
        },
    }))