export const MANIFEST_ITEM_TYPES = [
    'ManifestItem::Delivery',
    'ManifestItem::Transfer',
    'ManifestItem::Pick',
    'ManifestItem::ReversePick',
    'ManifestItem::DispatchDraft',
    'ManifestItem::Consolidation',
] as const;

export type ManifestItemType = typeof MANIFEST_ITEM_TYPES[number];

export const MANIFEST_ITEM_TYPES_LABELS: Record<ManifestItemType, string> = {
    'ManifestItem::Delivery': 'Entrega',
    'ManifestItem::Transfer': 'Transferência',
    'ManifestItem::Pick': 'Coleta',
    'ManifestItem::ReversePick': 'Coleta Reversa',
    'ManifestItem::DispatchDraft': 'Despacho',
    'ManifestItem::Consolidation': 'Retirada',
};

export function isKnownManifestItemType(value: string): value is ManifestItemType {
    return (MANIFEST_ITEM_TYPES as readonly string[]).includes(value);
}

export function getManifestItemTypeLabel(value: string): string {
    return isKnownManifestItemType(value) ? MANIFEST_ITEM_TYPES_LABELS[value] : value;
}