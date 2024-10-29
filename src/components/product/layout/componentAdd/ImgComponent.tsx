import { URL_IMAGE } from '@/utils/constante';
import clsx from 'clsx';
import { ReactNode, useEffect, useState } from 'react';

import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

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
	const [isLoading, setIsLoading] = useState(false);
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
							borderTopColor: 'rgba(255, 255, 255, 1)',
						}}
						className="inline-block size-8 animate-spin rounded-full text-gray-200"
					></div>
				</div>
			)}
			<Swiper
				modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
				spaceBetween={12}
				pagination={{ clickable: true, dynamicBullets: true }}
				scrollbar={{ draggable: true }}
				preventClicksPropagation={true}
				mousewheel={true}
				className="relative size-full"
				autoplay={{
					delay: 6500,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
					reverseDirection: true,
				}}
			>
				{photos.map((i, index) => (
					<SwiperSlide key={index}>
						<img
							src={`${URL_IMAGE}${i}`}
							alt={title}
							className={clsx(
								` size-full rounded-md bg-cover bg-center bg-no-repeat object-cover transition-all duration-500`,
								{
									'blur-[4px]': isLoading,
									'blur-none': !isLoading,
								}
							)}
							loading="lazy"
							onLoad={handleImageLoad}
							onError={(e) => {
								e.currentTarget.src = '/img/imgError.png';
							}}
						/>
						{children}
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}
