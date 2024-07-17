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
		const isOutSide = e.target.firstChild?.getAttribute?.('data-outside');
		if (setHide && isOutSide) {
			setHide(false);
		}
	};
	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label="edit/create"
			className={twMerge(
				'relative z-60',
				isOpen ? 'pointer-events-auto' : 'pointer-events-none'
			)}
			tabIndex={-1}
			onClick={handleHideModal}
		>
			<div
				className={twMerge(
					`fixed z-60 inset-0 flex justify-${position} bg-black/25 duration-300 ease-in-out`,
					isOpen ? `opacity-100  pointer-events-auto ` : 'opacity-0 pointer-events-none'
				)}
			>
				<div
					data-outside="outside"
					className={twMerge(
						'duration-300 ease-linear',
						styleContainer,
						isOpen ? animation[animationName][0] : animation[animationName][1]
					)}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
