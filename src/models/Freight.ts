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

        invoices_volumes: types.optional(types.number, 0),
        invoices_mapping: types.optional(
            types.array(types.string),
            []
        )
    })
    .views((self) => ({
        get documentNumber(): string {
            let draftNumber = (self.draft_number) ? self.draft_number : '';
            let cteNumber = (self.cte_number) ? self.cte_number : '';
            
            return `${cteNumber}/${draftNumber}` 
        },
        get allInvoicesListed(): string {
            if (self.invoices_volumes > 2) {
                let invoices = self.invoices_mapping.slice(0, 2);
                return invoices.join(', ') + '...'
            }

            return self.invoices_mapping.join(', ')
        }
    }))