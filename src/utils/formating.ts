/// Date
import {
	format,
	isThisYear,
	isToday,
	isYesterday,
} from 'date-fns';

export const formatDate = (timestamp: Date | string) => {
	const messageDate = new Date(timestamp);

	let formattedDate;

	if (isToday(messageDate)) {
		formattedDate = format(messageDate, 'HH:mm');
	} else if (isYesterday(messageDate)) {
		formattedDate = 'Hier';
	} else if (isThisYear(messageDate)) {
		formattedDate = format(messageDate, 'dd/MM');
	} else {
		formattedDate = format(messageDate, 'dd/MM/yyyy');
	}

	return formattedDate;
};
