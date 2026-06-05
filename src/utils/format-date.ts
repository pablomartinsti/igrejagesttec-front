import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

function getDateOnly(date: string): string {
  const match = date.match(/^(\d{4}-\d{2}-\d{2})/);
  return match?.[1] || date;
}

export function formatDate(date: string): string {
  const dateOnly = getDateOnly(date);

  const isoDate = dayjs(dateOnly, 'YYYY-MM-DD', true);
  if (isoDate.isValid()) {
    return isoDate.format('YYYY-MM-DD');
  }

  const brazilianDate = dayjs(dateOnly, 'DD/MM/YYYY', true);
  if (brazilianDate.isValid()) {
    return brazilianDate.format('YYYY-MM-DD');
  }

  return date;
}

export function formatDateInput(date: string): string {
  return formatDate(date);
}

export function formatDateDisplay(date: string): string {
  const normalizedDate = formatDate(date);
  const parsedDate = dayjs(normalizedDate, 'YYYY-MM-DD', true);

  if (parsedDate.isValid()) {
    return parsedDate.format('DD/MM/YYYY');
  }

  return date;
}
