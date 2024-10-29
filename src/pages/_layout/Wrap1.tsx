/* eslint-disable @typescript-eslint/no-explicit-any */

import { twMerge } from 'tailwind-merge';

export default function Wrap1({ child, style }: { child: any; style?: string }) {
	return (
		<div className="grid grid-cols-[1fr_minmax(1020px,_1fr)_1fr] gap-x-4 lg:grid-cols-1">
			<div
				className={twMerge(
					'block  lg:hidden',
					style?.includes('bg-white')
						? 'bg-white'
						: 'bg-gradient-to-t from-[#677d92] via-[#98745d] to-[#71a2b5]'
				)}
			></div>
			<div className="w-full bg-white">{child}</div>
			<div
				className={twMerge(
					'block  lg:hidden',
					style?.includes('bg-white')
						? 'bg-white'
						: 'bg-gradient-to-t from-[#677d92] via-[#98745d] to-[#71a2b5]'
					// !style?.includes('bg-white') && '
				)}
			></div>
		</div>
	);
}
