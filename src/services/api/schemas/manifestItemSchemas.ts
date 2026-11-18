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