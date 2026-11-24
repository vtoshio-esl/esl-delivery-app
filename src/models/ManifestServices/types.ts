import type { ManifestItem } from "./ManifestItem"
import type { UnloadingRecipient } from "./UnloadingRecipient"

export type ManifestService = ManifestItem | UnloadingRecipient;
export type ManifestServiceKind = ManifestService['kind'];

export type ServiceKey = {
    id: number;
    kind: ManifestServiceKind;
}

export const getServiceKey = (s: ManifestService) => `${s.id}:${s.kind}`