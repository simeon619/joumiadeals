import { Link } from '@tanstack/react-router';
import { twMerge } from 'tailwind-merge';

export default function Name() {
	// const { value } = useHideFilter((state) => state);
	return (
		<Link
			to="/"
			className={twMerge('font-poppins text-xl font-extrabold tracking-tighter text-primary')}
		>
			amedeals
		</Link>
	);
}
