import { getEnv, getRoot, types } from "mobx-state-tree";
import { File } from "expo-file-system";
import { uuid } from "expo";

import { ManifestService, ServiceKey } from "../models/ManifestServices/types";
import { ManifestItem } from "../models/ManifestServices/ManifestItem";
import { addDeliveryReceiptRequest } from "../services/api/schemas/manifestItemSchemas";
import { formatDateTimeToLocale } from "../helpers/dateFormat";
import { RootStore } from "./RootStore";
import { Environment } from "../services/environment";

export const DeliveryDraftStore = types
    .model('DeliveryDraftStore')
    .props({
        selectedKey: types.maybeNull(types.frozen<ServiceKey>()),

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
            return self.selectedKey ? 1 : 0;
        },
        get selectedService(): ManifestService | undefined {
            const manifest = getRoot<RootStore>(self).manifestStore.selectedManifest;
            if (!manifest || !self.selectedKey) return undefined;

            return manifest.getServiceById(self.selectedKey.id, self.selectedKey.kind);
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
        get serviceForImages(): ManifestItem | undefined {
            const service = self.selectedService;
            
            return (service?.kind === 'manifest_item' && !!service.freight) 
                ? service
                : undefined;  
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
            self.selectedKey = { id: service.id, kind: service.kind }; 
        },
        clearSelectedService: () => {
            self.selectedKey = null;
        },
        
        setOccurrence: (id: number) => {
            self.occurrenceId = id;
            self.occurrenceAt = new Date().toISOString();
        },
        setReceiverName: (v: string) => self.receiverName = v,
        setReceiverDocument: (v: string) => self.receiverDocument = v,
        setComments: (v: string) => self.comments = v,
        setKinship: (v: number) => self.receiverKinship = v,
        
        setSignature: (uri: string) => self.signature = uri,
        setDeliveryReceipt: (uri: string) => self.deliveryReceipt = uri,
        setAttachment: (uri: string) => self.attachment = uri,

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
            const occurrence = service.effectiveOccurrence;

            self.occurrenceId = occurrence?.occurrence_id ?? null;
            self.occurrenceAt = occurrence?.occurrence_at ?? null;
            self.receiverName = occurrence?.receiver ?? '';
            self.receiverDocument = occurrence?.document_number ?? '';
            self.comments = occurrence?.comments ?? '';
        }
    }))
    .actions((self) => ({
        reloadFromSelected: () => {
            const service = self.selectedService;
            if (service) self.loadFromService(service);
        }
    }))
    .actions((self) => { 
        const requireContext = () => {
            const { manifestStore } = getRoot<RootStore>(self);

            const manifest = manifestStore.selectedManifest;
            if (!manifest) throw new Error('Manifesto não encontrado.')

            const service = self.selectedService;
            if (!service) throw new Error('Nenhum serviço selecionado.')
        
            return { manifestStore, manifest, service }
        }

        return {
            confirmArrival: async () => {
                const { manifestItemApi } = getEnv<Environment>(self);
                const { manifestStore, manifest, service } = requireContext();

                const arrivedAt = new Date().toISOString();
                
                await manifestItemApi.updateArrivalAt({
                    manifestId: manifest.id,
                    service,
                    arrivedAt
                })
    
                await manifestStore.fetchSelectedManifest(manifest.id);    
            },
            confirmExitedAt: async () => {
                const { manifestItemApi } = getEnv<Environment>(self);
                const { manifestStore, manifest, service } = requireContext();
    
                const exitedAt = new Date().toISOString();
                await manifestItemApi.updateExitedAt({
                    manifestId: manifest.id,
                    service,
                    exitedAt
                })
    
                await manifestStore.fetchSelectedManifest(manifest.id);
            },
            sendReceipt: async (): Promise<void> => {
                const { manifestItemApi } = getEnv<Environment>(self);
                const { manifest } = requireContext();
                
                const service = self.serviceForImages;
    
                const uri = self.deliveryReceipt;
                if (!uri || !service) 
                    throw Error('Comprovante não encontrado para envio ao TMS.');
    
                const base64 = new File(uri).base64Sync();
                const payload: addDeliveryReceiptRequest = {
                    manifestId: manifest.id,
                    isSignature: false,
                    service,
                    base64,
                }
                console.log('[RECEIPT] Payload de envio:', payload);
                
    
                return service.type === 'ManifestItem::ReversePick'
                    ? manifestItemApi.addReversePickReceipt(payload)
                    : manifestItemApi.addDeliveryReceipt(payload)
            },
            sendAttachment: async (): Promise<void> => {
                const { manifestItemApi } = getEnv<Environment>(self);
                const { manifest } = requireContext();

                const service = self.serviceForImages;
                const uri = self.attachment;
    
                if (!uri || !service) 
                    throw new Error('Anexo não encontrado para envio ao TMS.');
    
                return manifestItemApi.addImage({ manifestId: manifest.id, service, uri })                        
            },
            sendOccurrence: async () => {
                const { manifestItemApi } = getEnv<Environment>(self);
                const { manifest, service } = requireContext();
                    
                const payload = self.buildOccurrencePayload;
    
                try {
                    await manifestItemApi.setOccurrence({
                        manifestId: manifest.id,
                        payload,
                        service
                    })
                } catch (e: any) {
                    if (e?.response?.status === 429) {
                        throw new Error('Aguarde 30 segundos antes de tentar baixar esse item novamente.')
                    }

                    throw e;
                }
            }
        }
    })
    .actions((self) => ({
        submitDelivery: async () => {
            const { manifestStore } = getRoot<RootStore>(self);

            const manifest = manifestStore.selectedManifest;
            const service = self.selectedService;

            if (!manifest) throw new Error('Manifesto não encontrado.');
            if (!service) throw new Error('Nenhum serviço selecionado.');

            await manifestStore.trackServiceErrors(service, async () => {
                if (self.deliveryReceipt) await self.sendReceipt();
                if (self.attachment) await self.sendAttachment();

                await self.sendOccurrence();
            })
            
            await manifestStore.fetchSelectedManifest(manifest.id);
            await self.reloadFromSelected();
        }
    }))