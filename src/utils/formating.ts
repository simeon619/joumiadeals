/// Date
import {
	format,
	isThisWeek,
	isThisYear,
	isToday,
	startOfDay,
	startOfWeek,
	subDays,
} from 'date-fns';
import fr from 'date-fns/locale/fr';

const locale = fr;
export const formatDate = (timestamp: Date | string | undefined) => {
	if (!timestamp) return 'Maintenant';
	const messageDate = new Date(timestamp);

	const today = new Date();
	const startOfToday = startOfDay(today);
	const startOfYesterday = subDays(startOfToday, 1);
	const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });

	if (isToday(messageDate)) {
		//ts-ignore
		return `Aujourd'hui à ${format(messageDate, 'HH:mm', {
			locale,
		})}`;
	}

	if (messageDate >= startOfYesterday && messageDate < startOfToday) {
		return `Hier à ${format(messageDate, 'HH:mm', {
			locale,
		})}`;
	}

	if (messageDate >= startOfWeekDate && isThisWeek(messageDate)) {
		return format(messageDate, "EEEE 'à' HH:mm", {
			locale,
		});
	}

	if (isThisYear(messageDate)) {
		return format(messageDate, "dd MMMM 'à' HH:mm", {
			locale,
		});
	}

	return format(messageDate, "dd MMMM yyyy 'à' HH:mm", {
		locale,
	});
};
