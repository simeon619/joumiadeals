import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { twMerge } from 'tailwind-merge';

export default function AvatarComponent({
	url,
	name,
	style,
}: {
	url?: string;
	name?: string;
	style?: string;
}) {
	return (
		<Avatar className={twMerge(style)}>
			<AvatarImage  src={url ? url : ''} alt={name ? name : 'avatar'} />
			<AvatarFallback>{name ? name.slice(0, 2) : '??'}</AvatarFallback>
		</Avatar>
	);
}
