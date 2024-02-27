import { Mail } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function PopMessage() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
		
		<button
			onClick={() => setIsOpen((prev) => !prev)}
			className={twMerge(
				'fixed bottom-[1px] right-10 flex w-[340px] items-center justify-between rounded-t-lg bg-slate-900 p-2 duration-300 text-white shadow-xl',
				isOpen && 'h-[500px]'
			)}
		>
			{!isOpen && (
				<>
					<span className={' text-lg'}>Messages</span>
					<Mail size={20} strokeWidth={2} absoluteStrokeWidth />
				</>
			)}
		</button>
		</>
	);
}
