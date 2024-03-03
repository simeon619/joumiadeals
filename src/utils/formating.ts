/// Date
import {
	format,
	isToday,
	isThisWeek,
	isThisYear,
	startOfWeek,
	subDays,
	startOfDay,
} from 'date-fns';
import fr from 'date-fns/locale/fr';

export const formatDate = (timestamp: Date | string | undefined) => {
	if (!timestamp) return 'Maintenant';
	const messageDate = new Date(timestamp);

	const today = new Date();
	const startOfToday = startOfDay(today);
	const startOfYesterday = subDays(startOfToday, 1);
	const startOfWeekDate = startOfWeek(today, { weekStartsOn: 1 });

	if (isToday(messageDate)) {
		//ts-ignore 
		return `Aujourd'hui à ${format(messageDate, 'HH:mm', { locale: fr })}`;
	}

	if (messageDate >= startOfYesterday && messageDate < startOfToday) {
		//ts-expect-error is not typed

		return `Hier à ${format(messageDate, 'HH:mm', { locale: fr })}`;
	}

	if (messageDate >= startOfWeekDate && isThisWeek(messageDate)) {
		return format(messageDate, "EEEE 'à' HH:mm", { locale: fr });
	}

	if (isThisYear(messageDate)) {
		return format(messageDate, "dd MMMM 'à' HH:mm", { locale: fr });
	}

	return format(messageDate, "dd MMMM yyyy 'à' HH:mm", { locale: fr });
};
