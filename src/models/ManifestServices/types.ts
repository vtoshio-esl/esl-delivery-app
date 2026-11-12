import type { ManifestItem } from "./ManifestItem"
import type { UnloadingRecipient } from "./UnloadingRecipient"

export type ManifestService = ManifestItem | UnloadingRecipient;
export type ManifestServiceKind = ManifestService['kind'];