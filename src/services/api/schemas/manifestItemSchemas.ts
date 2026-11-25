import { number } from "mobx-state-tree/dist/internal";
import { ManifestItemModel } from "../../../models/ManifestServices/ManifestItem";
import { ManifestService } from "../../../models/ManifestServices/types";

export interface UpdateArrivalAtRequest {
    manifestId: number
    service: ManifestService,
    arrivedAt: string
}

export type SetOccurrenceManifestItemData = {
    mobile_uuid?: string;
    occurrence_id?: number;
    occurrence_at?: string;
    receiver?: string;
    document_number?: string;
    comments?: string;
    latitude?: string;
    longitude?: string;
}

export interface SetOccurrenceRequest {
    manifestId: number,
    service: ManifestService,
    payload: SetOccurrenceManifestItemData;
}

export interface UpdateExitedAtRequest {
    manifestId: number;
    service: ManifestService;
    exitedAt: string;
}

export interface addDeliveryReceiptRequest {
    manifestId: number;
    service: ManifestService;
    base64: string;
    isSignature: boolean;
}

export interface addImageRequest {
    manifestId: number;
    service: ManifestService;
    uri: string;
}

export interface SetEventData {
    occurrence_id: number;
    occurrence_at: string;
    comments?: string;
}

export interface SetEventRequest {
    manifestId: number;
    service: ManifestService;
    payload: SetEventData;
}