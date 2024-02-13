import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

export default function PopUpComponent({
	isOpen,
	children,
	styleContainer,
}: PropsWithChildren<{ isOpen: boolean; styleContainer?: string }>) {
	return (
		<div className="relative">
			<div
				className={twMerge(
					`fixed inset-0 z-50 flex items-start  justify-center bg-black/50  duration-500 ease-in-out`,
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				)}
			>
				<div
					className={twMerge(
						' duration-300 ease-out ',
						styleContainer,
						isOpen ? 'translate-x-1000 ' : ' translate-y-full '
					)}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
