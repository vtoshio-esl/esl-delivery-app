import { getEnv, getRoot, types } from "mobx-state-tree";

import { ManifestService, ManifestServiceKind } from "../models/ManifestServices/types";
import { ManifestItem } from "../models/ManifestServices/ManifestItem";
import { RootStore } from "./RootStore";
import { formatDateTimeToLocale } from "../helpers/dateFormat";
import { Environment } from "../services/environment";
import { uuid } from "expo";

export type ServiceKey = {
    id: number;
    kind: ManifestServiceKind;
}

export const DeliveryDraftStore = types
    .model('DeliveryDraftStore')
    .props({
        selectedKeys: types.array(types.frozen<ServiceKey>()),

        occurrenceId: types.maybeNull(types.number),
        occurrenceAt: types.maybeNull(types.string),

        signature: types.maybeNull(types.string),
        deliveryReceipt: types.maybeNull(types.string),
        attachment: types.maybeNull(types.string),

        receiverKinship: types.optional(types.number, 0),
        receiverName: types.maybeNull(types.string),
        receiverDocument: types.maybeNull(types.string),
        comments: types.optional(types.string, ''),
    })
    .views((self) => ({
        get countSelectedServices(): number {
            return self.selectedKeys.length;
        },
        get getSelectedServices(): ManifestService[] {
            const manifest = getRoot<RootStore>(self).manifestStore.selectedManifest;
            if (!manifest) return [];

            return self.selectedKeys
                .map((k) => manifest.getServiceById(k.id, k.kind))
                .filter((s): s is ManifestService => s !== undefined)
        },
        get formattedOccurrenceAt(): string {
            if (!self.occurrenceAt) return '';

            return formatDateTimeToLocale(self.occurrenceAt);
        },
        get hasReceiverData(): boolean {
            return !!self.receiverDocument?.trim() && !!self.receiverName?.trim();
        },
        get hasPhotoTaken(): boolean {
            return !!self.signature || !!self.deliveryReceipt || !!self.attachment
        }
    }))
    .views((self) => ({
        get firstSelectedService(): ManifestService | undefined {
            return self.getSelectedServices[0];
        },
        get getExitedAtReference(): ManifestItem | undefined {
            return self.getSelectedServices.find(
                (s): s is ManifestItem => s.kind === 'manifest_item'
            )
        },
        get kinshipList() {
            return [
                { id: 0, value: 'Próprio Recebedor' },
                { id: 1, value: 'Pai' },
                { id: 2, value: 'Mãe' },
                { id: 3, value: 'Irmão(a)' },
                { id: 4, value: 'Avô(a)' },
                { id: 5, value: 'Bisavô(a)' },
                { id: 6, value: 'Tio(a)' },
                { id: 7, value: 'Sobrinho(a)' },
                { id: 8, value: 'Primo(a)' },
                { id: 9, value: 'Sogro(a)' },
                { id: 10, value: 'Genro ou Nora' },
                { id: 11, value: 'Cunhado(a)' },
                { id: 12, value: 'Vizinho' },
                { id: 13, value: 'Porteiro' },
                { id: 14, value: 'Recepcionista' },
                { id: 15, value: 'Cônjuge' },
            ]
        }
    }))
    .views((self) => ({
        get kinshipForSelect() {
            return self.kinshipList.map(
                (item) => { return { label: item.value.toUpperCase(), value: item.id} }
            )
        },
        kinshipFromId: (id: number) => {
            return self.kinshipList.find((item) => item.id === id)
        },
    }))
    .views((self) => ({
        get buildOccurrencePayload() {
            const kinship = self.kinshipFromId(self.receiverKinship)?.value;

            return {
                mobile_uuid: uuid.v4(),
                occurrence_id: self.occurrenceId ?? undefined,
                occurrence_at: self.occurrenceAt ?? undefined,
                receiver: self.receiverName?.trim() || undefined,
                document_number: self.receiverDocument?.trim() || undefined,
                comments: [kinship && `Recebido por ${kinship}`, self.comments.trim()].filter(Boolean).join(' - ')
            }
        },
    }))
    .actions((self) => ({
        selectService: (service: ServiceKey) => {
            self.selectedKeys.push(service); 
        },
        clearSelectedServices: () => {
            self.selectedKeys.clear();
        },
        
        setOccurrence: (id: number) => {
            self.occurrenceId = id;
            self.occurrenceAt = new Date().toISOString();
        },
        setReceiverName: (v: string) => self.receiverName = v,
        setReceiverDocument: (v: string) => self.receiverDocument = v,
        setComments: (v: string) => self.comments = v,
        setKinship: (v: number) => self.receiverKinship = v,
        
        clearForm: () => {
            self.receiverName = '';
            self.receiverDocument = '';
            self.comments = '';
            self.receiverKinship = 0;
            
            self.occurrenceId = null;
            self.occurrenceAt = null;

            self.signature = null;
            self.attachment = null;
            self.deliveryReceipt = null;
        },
        
        loadFromService: (service: ManifestService) => {
            self.occurrenceId = service.occurrence_id;
            self.occurrenceAt = service.occurrence_at;
            self.receiverName = service.receiver ?? '';
            self.receiverDocument = service.document_number ?? '';
            self.comments = service.comments ?? '';
        }
    }))
    .actions((self) => ({
        confirmArrival: async () => {
            const { manifestItemApi } = getEnv<Environment>(self);
            const { manifestStore } = getRoot<RootStore>(self);

            const manifest = manifestStore.selectedManifest;
            if (!manifest) 
                throw new Error('Manifesto não encontrado');

            const selectedServices = self.getSelectedServices;
            if (selectedServices.length === 0)
                throw new Error('Nenhum item encontrado para dar baixa.')

            const arrivedAt = new Date().toISOString();
            const results = await Promise.allSettled(
                selectedServices.map((item) => {
                    return manifestItemApi.updateArrivalAt({
                        manifestId: manifest.id,
                        service: item,
                        arrivedAt,
                    })
                }
            ))

            await manifestStore.fetchSelectedManifest(manifest.id);

            const failed = results.filter((r) => r.status === 'rejected').length;
            if (failed > 0) {
                throw new Error(`${failed} de ${selectedServices.length} serviço(s) não tiveram chegada confirmada.`)
            } 
        },
        confirmExitedAt: async () => {
            const { manifestItemApi } = getEnv<Environment>(self);
            const { manifestStore } = getRoot<RootStore>(self);

            const manifest = manifestStore.selectedManifest;
            if (!manifest) 
                throw new Error('Manifesto não encontrado');

            const selectedServices = self.getSelectedServices;
            if (selectedServices.length === 0)
                throw new Error('Nenhum item encontrado para dar baixa.')

            const exitedAt = new Date().toISOString();
            const results = await Promise.allSettled(
                selectedServices.map((item) => {
                    return manifestItemApi.updateExitedAt({
                        manifestId: manifest.id,
                        service: item,
                        exitedAt,
                    })
                }
            ))

            await manifestStore.fetchSelectedManifest(manifest.id);

            const failed = results.filter((r) => r.status === 'rejected').length;
            if (failed > 0) {
                throw new Error(`${failed} de ${selectedServices.length} serviço(s) não tiveram chegada confirmada.`)
            }
        },
        sendOccurrence: async () => {
            const { manifestItemApi } = getEnv<Environment>(self);
            const { manifestStore } = getRoot<RootStore>(self);
            
            const manifest = manifestStore.selectedManifest;
            if (!manifest) return;

            const services = self.getSelectedServices;
            const payload = self.buildOccurrencePayload;

            const results = await Promise.allSettled(
                services.map((service) => 
                    manifestItemApi.setOccurrence({
                        manifestId: manifest.id,
                        service,
                        payload,
                    })
                )
            );
            
            manifestStore.fetchSelectedManifest(manifest.id);  
            
            const failed = results.filter((r) => r.status === 'rejected');
            if (failed.length > 0) {
                const first = (failed[0] as PromiseRejectedResult).reason;
                
                if (first?.response?.status === 429) {
                    throw new Error('Aguarde 30 segundos antes de tentar a baixar deste item novamente.')
                } 

                throw new Error(`${failed.length} de ${services.length} serviço(s) não tiveram a baixa registrada.`);
            }
        }
    }))