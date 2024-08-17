import { URL_IMAGE } from '@/utils/constante';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';

export default function ImgComponent({
	photos,
	title,
	children,
	style,
}: {
	photos: string[];
	title: string;
	children?: ReactNode;
	style?: string;
}) {
	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
	const [fade, setFade] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	let timeoutId: NodeJS.Timeout | undefined;
	let timeoutId2: NodeJS.Timeout | undefined;
	const handleImageChange = (index: number) => {
		if (index === currentImageIndex) return;
		setFade(false);
		setIsLoading(true);
		timeoutId2 = setTimeout(() => {
			setCurrentImageIndex(index);
			setFade(true);
			setIsLoading(false);
		}, 300);
	};
	const handleImageLoad = () => {
		timeoutId = setTimeout(() => {
			setIsLoading(false);
		}, 300);
	};
	useEffect(() => {
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			if (timeoutId2) clearTimeout(timeoutId2);
		};
	}, [timeoutId, timeoutId2]);
	return (
		<div
			className={clsx(
				'group relative flex flex-none justify-center rounded-md border bg-slate-400',
				style
			)}
			style={{
				transform: fade ? 'scale(1)' : 'scale(.98)',
				transition: 'transform 0.5s ease-in-out',
			}}
			aria-label={title}
		>
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div
						style={{
							border: '4px solid rgba(255, 255, 255, 0.2)',
							borderTopColor: 'rgba(255, 255, 255, 0.8)',
						}}
						className="inline-block size-8 animate-spin rounded-full text-gray-200"
					></div>
				</div>
			)}
			<img
				src={`${URL_IMAGE}${photos[currentImageIndex]}`}
				alt={title}
				className={`size-full rounded-md bg-cover bg-center bg-no-repeat object-cover transition-all duration-500 ${
					isLoading ? 'blur-[2px]' : 'blur-0'
				}`}
				loading="lazy"
				onLoad={handleImageLoad}
				onError={(e) => {
					e.currentTarget.src = '/img/imgError.png';
				}}
			/>
			<div className="absolute inset-x-0 bottom-[-10px] flex justify-center">
				{photos.length > 1 &&
					photos.map((_, index) => (
						<button
							key={index}
							// style={{ bottom: `${index * 20}px` }}
							className={`mx-1 size-2 rounded-full p-1 hover:bg-white ${currentImageIndex === index ? 'bg-primary' : 'bg-gray-400'}`}
							onMouseOver={(e) => {
								e.preventDefault();
								e.stopPropagation();
								handleImageChange(index);
							}}
							onFocus={(e) => {
								e.preventDefault();
								e.stopPropagation();
								handleImageChange(index);
							}}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								handleImageChange(index);
							}}
						/>
					))}
			</div>
			{children}
		</div>
	);
}
