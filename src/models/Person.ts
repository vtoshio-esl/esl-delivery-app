import { types, SnapshotIn, SnapshotOut, Instance } from "mobx-state-tree";
import { CorporationModel } from "./Corporation";

export const PersonModel = CorporationModel
    .named('Person')
    .props({
        type: types.optional(
            types.enumeration(['Company', 'Individual']),
            'Individual'
        ),
        cnpj: types.maybeNull(types.string),
        cpf: types.maybeNull(types.string),
    })