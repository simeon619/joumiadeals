import { useHideFilter } from '@/services/state/App/hideFilter';
import { Link } from '@tanstack/react-router';
import { twMerge } from 'tailwind-merge';

export default function Name() {
	// const { value } = useHideFilter((state) => state);
	return (
		<Link to="/" className={twMerge("font-poppins text-3xl font-extrabold tracking-tighter text-primary")}>
			Joumiadeals
		</Link>
	);
}
