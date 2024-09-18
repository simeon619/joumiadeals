import { Link } from '@tanstack/react-router';
import { twMerge } from 'tailwind-merge';

export default function Name() {
	// const { value } = useHideFilter((state) => state);
	return (
		<Link to="/" className={twMerge('font-CocoBiker text-3xl tracking-tighter font-bold text-primary')}>
			AmeDeals
		</Link>
	);
}
