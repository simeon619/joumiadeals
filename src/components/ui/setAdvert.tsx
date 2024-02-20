import { Link } from '@tanstack/react-router';
import { PlusCircle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function SetAdvert({ style }: { style?: string }) {
	return (
		<Link
			to="/creation_annonce"
			className={twMerge(
				`flex h-10 max-w-[200px] cursor-pointer flex-row items-center gap-1 rounded-xl bg-primary  px-2`,
				style
			)}
		>
			<PlusCircle color="white" size={15} />
			<span className="whitespace-nowrap font-poppins text-[14px] font-bold text-white">
				Publier une annonce
			</span>
		</Link>
	);
}
