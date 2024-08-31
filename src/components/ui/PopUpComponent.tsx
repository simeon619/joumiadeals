/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
const animation = {
	zoom: ['scale-100', 'scale-0'],
	fade: ['opacity-100', 'opacity-0'],
	translateRight: ['translate-x-0', 'translate-x-full'],
	translateLeft: ['translate-x-0', '-translate-x-full'],
	translateTop: ['translate-y-0', '-translate-y-full'],
	translateBottom: ['translate-y-0', 'translate-y-full'],
} as const;
export default function PopUpComponent({
	isOpen,
	children,
	styleContainer,
	animationName = 'zoom',
	setHide,
	position = 'center',
}: PropsWithChildren<{
	isOpen: boolean;
	styleContainer?: string;
	animationName?: keyof typeof animation;
	setHide?: (value?: any) => void;
	position?: 'start' | 'end' | 'center';
}>) {
	const handleHideModal = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		const isOutSide = e.target.getAttribute?.('data-outside');
		if (setHide && isOutSide) {
			setHide(false);
		}
	};
	return (
		<div
			role="dialog"
			aria-modal="true"
			className={twMerge(
				`fixed inset-0 z-50 flex bg-black/50 duration-300 ease-in-out`,
				isOpen
					? `opacity-100 pointer-events-auto select-none`
					: 'opacity-0 pointer-events-none select-auto'
			)}
			onClick={handleHideModal}
		>
			<div
				data-outside="outside"
				className={twMerge(
					'relative transition-all z-50 duration-300 ease-in-out',
					position === 'start' ? 'justify-start' : position === 'end' ? 'justify-end' : 'justify-center',
					styleContainer,
					isOpen ? animation[animationName][0] : animation[animationName][1]
				)}
			>
				{children}
			</div>
		</div>
	);
}
