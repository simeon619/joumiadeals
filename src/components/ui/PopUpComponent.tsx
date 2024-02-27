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
}: PropsWithChildren<{
	isOpen: boolean;
	styleContainer?: string;
	animationName?: keyof typeof animation;
}>) {
	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label="edit/create"
			className={twMerge('relative z-50')}
		>
			<div
				className={twMerge(
					`fixed inset-0 z-50 flex items-start justify-center bg-black/65 duration-100 ease-in-out`,
					isOpen ? 'opacity-100  pointer-events-auto' : 'opacity-0 pointer-events-none'
				)}
			>
				<div
					className={twMerge(
						'duration-300 ease-out',
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
