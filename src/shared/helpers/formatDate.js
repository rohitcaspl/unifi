/* eslint-disable no-trailing-spaces */
/* eslint-disable curly */
import { format, parseISO } from 'date-fns';


const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return 'Invalid date';
  
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

const formatFormDate = date => format(date, 'd/MM/y p');

const formatIsoToDotted = date => format(date, 'dd.MM.yyyy');

export { formatDate, formatFormDate, formatIsoToDotted };
