/* eslint-disable @typescript-eslint/no-explicit-any */
import { URL_IMAGE } from '@/utils/constante';
import clsx from 'clsx';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import { useState } from 'react';

export default function ImagePagination({
	photos,
	style,
}: {
	photos: string[];
	style?: { imageStyle?: string; zTop?: boolean };
}) {
	const [currentIndex, setCurrentIndex] = useState(0);
	// const [touchStartX, setTouchStartX] = useState(0);
	// const [touchEndX, setTouchEndX] = useState(0);
	const handlePrevious = () => {
		setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
	};

	return (
		<>
			<div
				// onTouchStart={handleTouchStart}
				// onTouchMove={handleTouchMove}
				// onTouchEnd={handleTouchEnd}
				// draggable={false}
				// contentEditable={false}
				className="flex  flex-row items-center justify-center"
			>
				<ChevronFirst
					onClick={handlePrevious}
					className="cursor-pointer rounded-full bg-white/50 text-slate-600"
					size={21}
				/>
				<div
					className={clsx(`flex flex-col bg-contain bg-center bg-no-repeat  ${style?.imageStyle}`)}
					draggable={false}
					style={{
						backgroundImage: `url(${URL_IMAGE + photos[currentIndex]})`,
					}}
				>
					<p className="pb-10 font-roboto text-xs text-gray-400">
						{currentIndex + 1}/{photos.length}
					</p>
				</div>
				<ChevronLast
					onClick={handleNext}
					className=" cursor-pointer rounded-full text-slate-600 "
					size={21}
				/>
			</div>
		</>
	);
}
