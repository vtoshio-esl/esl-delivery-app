export const AVAILABLE_FOR_LABELS = {
  delivery_manifest_items: 'Entregas',
  transfer_manifest_items: 'Transferências',
  pick_manifest_items: 'Coletas',
  reverse_pick_manifest_items: 'Coletas Reversas',
  dispatch_draft_manifest_items: 'Despachos',
  consolidation_manifest_items: 'Retiradas',
  freight_delivery_receipts: 'Comprovantes de Entrega',
  empty_pickup_scheduling_service: 'Coleta do vazio',
  harbor_pickup_scheduling_service: 'Coleta do cheio no porto',
  empty_devolution_scheduling_service: 'Devolução do vazio',
  transfer_scheduling_service: 'Transferência do vazio',
  full_transfer_scheduling_service: 'Transferência do cheio',
  harbor_delivery_scheduling_service: 'Entrega do cheio no porto',
  customer_delivery_scheduling_service: 'Entrega do cheio no cliente',
} as const;

export type AvailableFor = keyof typeof AVAILABLE_FOR_LABELS;

export function isKnownAvailableFor(value: string): value is AvailableFor {
  return value in AVAILABLE_FOR_LABELS;
}

export function getAvailableForLabel(value: string): string {
  return isKnownAvailableFor(value) ? AVAILABLE_FOR_LABELS[value] : value;
}
