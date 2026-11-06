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