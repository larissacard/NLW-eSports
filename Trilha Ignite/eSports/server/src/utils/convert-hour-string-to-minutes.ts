// 18:00 => ["18", "00"] => [18, 00]
export function ConverHourStringToMinutes(hourString: string){
    const [hours, minutes] = hourString.split(':').map(Number)

    const minutsAmount = (hours * 60) + minutes;

    return minutsAmount;
}