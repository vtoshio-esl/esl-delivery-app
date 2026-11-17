export function formatDateToLocale(serviceDate: string): string {
    const date = new Date(serviceDate);

    if (isNaN(date.getTime())) return serviceDate;
 
    return date.toLocaleDateString('pt-BR');
}

export function formatDateTimeToLocale(datetimeString: string): string {
    const date = new Date(datetimeString);

    if (isNaN(date.getTime())) return datetimeString;

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}

export function formatClockTime(datetimeString: string): string {
    const match = /(?:T|^)(\d{2}):(\d{2})/.exec(datetimeString);

    return match ? `${match[1]}:${match[2]}`: datetimeString;
}

export function formatTimeToInterval(startAt: string, endAt: string) {
    return `${formatClockTime(startAt)}-${formatClockTime(endAt)}`
}