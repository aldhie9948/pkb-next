import { format } from 'date-fns';
import idLocale from 'date-fns/locale/id';

export default function idDate(date) {
  return format(new Date(date), 'dd MMMM yyyy', { locale: idLocale });
}
