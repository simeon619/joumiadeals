import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default function TipsComponent({ tips }: { tips: string[] }) {
	const { inputFocus } = useInputCategorie((state) => state);
    // const [pingColor, setPingColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#000000');

    useEffect(() => {
        // setPingColor(getRandomColor());
        setBgColor(getRandomColor());
    }, []);

	return (
		<div
			className={clsx(
				'm-2 flex w-[300px] items-start rounded-lg bg-white p-4 shadow-md transition-all duration-500',
				inputFocus[tips[0]] && 'h-auto opacity-100',
				!inputFocus[tips[0]] && 'h-0 opacity-0'
			)}
		>
			 <div className="relative flex size-3">
            <span 
                className="absolute left-[-25%] top-[-25%] inline-flex size-[150%] animate-ping rounded-full opacity-75" 
                style={{ backgroundColor: bgColor }}
            ></span>
            <span 
                className="relative inline-flex size-3 rounded-full" 
                style={{ backgroundColor: bgColor }}
            ></span>
        </div>
			<div>
				<h1 className="mb-2 justify-center font-bebasneue text-xl font-bold text-neutral-900">{tips[0]}</h1>
				<ul className="list-decimal pl-5 text-sm text-neutral-600">
					{tips.map((tip, index) => {
                        if(index === 0) return null
                        return (
                            <li className="mb-2 font-roboto text-xs" key={index}>
                                {tip}
                            </li>
                        )
                    })}
				</ul>
			</div>
		</div>
	);
}
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}