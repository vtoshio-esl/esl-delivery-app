import { uuid } from "expo";
import { getEnv, getRoot, types } from "mobx-state-tree";

import { EventModel } from "../models/Event";

import { getServiceKey, ManifestService } from "../models/ManifestServices/types";
import { SetEventData } from "../services/api/schemas/manifestItemSchemas";
import { Environment } from "../services/environment";
import { RootStore } from "./RootStore";

export const EventsStoreModel = types
    .model('EventsStore')
    .props({
        events: types.optional(types.array(EventModel), [])
    })
    .views((self) => ({
        eventsFor: (service: ManifestService) => {
            const key = getServiceKey(service);

            return self.events
                .filter((e) => e.service_key === key)
                .sort((a, b) => b.occurrence_at.localeCompare(a.occurrence_at))
        }
    }))
    .actions((self) => ({ 
        addEvent: (
            serviceKey: string, 
            description: string,
            payload: SetEventData
        ) => {
            self.events.push({
                id: uuid.v4(),
                service_key: serviceKey,
                description,
                ...payload
            })
        },
        logout: () => {
            self.events.clear();
        }
    }))
    .actions((self) => {
        const requireContext = (occurrenceId: number) => {
            const { manifestStore, deliveryDraftStore, occurrencesStore } = getRoot<RootStore>(self);
        
            const manifest = manifestStore.selectedManifest;
            if (!manifest) 
                throw new Error('Manifesto não encontrado.');
            
            const service = deliveryDraftStore.selectedService;
            if (!service)
                throw new Error('Nenhum serviço selecionado.');

            const occurrence = occurrencesStore.occurrenceFromId(occurrenceId);
            if (!occurrence) {
                throw new Error('Ocorrência não encontrada.');
            }

            return { manifest, service, occurrence }
        }
        
        return {
            submitEvent: async (payload: SetEventData) => {
                const { manifestItemApi } = getEnv<Environment>(self);
                const { manifest, service, occurrence } = requireContext(payload.occurrence_id);

                const serviceKey = getServiceKey(service);
                const description = occurrence.description;

                await manifestItemApi.setEvent({
                    manifestId: manifest.id,
                    service,
                    payload
                });
                self.addEvent(serviceKey, description, payload);
            }
        }
    })
