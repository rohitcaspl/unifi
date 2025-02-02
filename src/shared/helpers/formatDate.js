import { format } from 'date-fns';

const formatDate = date => format(new Date(date), 'd MMM, y');

const formatFormDate = date => format(date, 'd/MM/y p');

const formatIsoToDotted = date => format(date, 'dd.MM.yyyy');

export { formatDate, formatFormDate, formatIsoToDotted };
