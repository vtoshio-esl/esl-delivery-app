export const DEALING_TRIGGERS = [
  'send_to_occurrences_dealing',
  'send_to_damages_dealing',
  'send_to_incidents_dealing',
] as const;
export const FINISHER_TRIGGERS = ['finish', 'done'] as const;
export const SCHEDULING_SERVICE_TRIGGERS = [
  'finish_scheduling_service',
  'reschedule_scheduling_service',
] as const;
export const BASIC_TRIGGERS = ['nothing', 'finish_reverse_pick', 'rollback_to_pending'] as const;

export const TRIGGERS = [
  ...BASIC_TRIGGERS,
  ...FINISHER_TRIGGERS,
  ...DEALING_TRIGGERS,
  ...SCHEDULING_SERVICE_TRIGGERS,
] as const;

export type OccurrenceTrigger = typeof TRIGGERS[number];

export const TRIGGER_LABELS: Record<OccurrenceTrigger, string> = {
  nothing: 'Nenhuma',
  finish_reverse_pick: 'Baixar Coleta Frete Reverso',
  rollback_to_pending: 'Voltar para pendente',
  finish: 'Baixar Entrega/Coleta',
  done: 'Finalizar Transporte',
  send_to_occurrences_dealing: 'Enviar para tratativa de ocorrências',
  send_to_damages_dealing: 'Enviar para tratativa de avarias',
  send_to_incidents_dealing: 'Enviar para tratativa de sinistros',
  finish_scheduling_service: 'Finalizar serviço de programação',
  reschedule_scheduling_service: 'Reagendar serviço de programação',
};

export function isKnownTrigger(value: string): value is OccurrenceTrigger {
    return (TRIGGERS as readonly string[]).includes(value);
}

export function getTriggerLabel(trigger: string): string {
    return isKnownTrigger(trigger) ? TRIGGER_LABELS[trigger] : trigger;
}