import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export default function CloseModal({
	closePopUp,
	style,
}: {
	closePopUp: () => void;
	style?: string;
}) {
	return (
		<X
			role="img"
			aria-label="close"
			className={twMerge(
				!style &&
					'absolute left-2 top-2 z-10 size-7 rounded-full hover:text-black cursor-pointer', style
			)}
			onClick={(e) =>{
				e.preventDefault();
				e.stopPropagation();
				closePopUp();
			}}
		/>
	);
}
