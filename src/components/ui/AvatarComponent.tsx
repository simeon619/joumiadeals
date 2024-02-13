import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { twMerge } from 'tailwind-merge';

export default function AvatarComponent({
	url,
	name,
	style,
}: {
	url: string;
	name: string;
	style?: string;
}) {
	return (
		<Avatar className={twMerge(style)}>
			<AvatarImage  src={url} alt={name} />
			<AvatarFallback>{name[0] + name[1]}</AvatarFallback>
		</Avatar>
	);
}
