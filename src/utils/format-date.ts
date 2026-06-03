import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export function formatDate(date: string): string {
  const isoDate = dayjs(date, 'YYYY-MM-DD', true);
  if (isoDate.isValid()) {
    return isoDate.format('YYYY-MM-DD');
  }

  const brazilianDate = dayjs(date, 'DD/MM/YYYY', true);
  if (brazilianDate.isValid()) {
    return brazilianDate.format('YYYY-MM-DD');
  }

  return date;
}

export function formatDateDisplay(date: string): string {
  return dayjs(date).format('DD/MM/YYYY');
}
