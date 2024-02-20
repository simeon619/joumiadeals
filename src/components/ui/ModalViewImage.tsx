import React, { useEffect, useState } from 'react';
import PopUpComponent from './PopUpComponent';
import { X } from 'lucide-react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/components/ui/carousel';
import { twMerge } from 'tailwind-merge';
import { URL_IMAGE } from '@/utils/constante';
import { ProductDetailType } from '@/services/api/product_categorie';
export default function ModalViewImage({
	showPopUp,
	closePopUp,
	product,
}: {
	showPopUp: boolean;
	closePopUp: () => void;
	product: ProductDetailType;
}) {
	const [current, setCurrent] = useState(0);
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		if (!api) {
			return;
		}
		setCurrent(() => {
			return isNaN(api.selectedScrollSnap() + 1) ? 1 : api.selectedScrollSnap() + 1;
		});

		api.on('select', () => {
			setCurrent(() => {
				return isNaN(api.selectedScrollSnap() + 1) ? 1 : api.selectedScrollSnap() + 1;
			});
		});
	}, [api]);
	return (
		<PopUpComponent styleContainer="relative h-full w-full overflow-scroll " isOpen={showPopUp}>
			<div className={`absolute inset-0 flex  flex-col items-center justify-center bg-white `}>
				<button onClick={() => closePopUp()}>
					<X role="img" aria-label="close" className="absolute left-2 top-2 z-10 size-7 text-red-600" />
				</button>
				<Carousel setApi={setApi} className="min-h-[300px] w-2/3 min-w-[300px]  max-w-[800px]">
					<CarouselContent>
						{product.photos.map((image, index) => (
							<CarouselItem key={index}>
								<div
									aria-label="product image"
									className="h-[70vw] w-full rounded-sm bg-contain bg-center bg-no-repeat md:h-[500px] lg:h-[700px]"
									style={{
										backgroundImage: `url(${URL_IMAGE}${image})`,
									}}
									role="img"
								></div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="-ml-10" />
					<CarouselNext className="-mr-10" />
				</Carousel>
				<div className="flex flex-col items-center justify-center gap-x-1">
					<div>
						<span>{product.title}</span>
					</div>
					<div className="flex h-40 items-stretch justify-center gap-x-1 ">
						{product.photos.map((image, index) => (
							<button
								onClick={() => {
									api?.scrollTo(index);
								}}
								key={index}
								aria-label="product image"
								className={twMerge(
									'rounded-sm bg-contain bg-center bg-no-repeat',
									current === index + 1 ? 'bg-primary/10' : ''
								)}
								style={{
									backgroundImage: `url(${URL_IMAGE}${image})`,
									width: '80px',
									height: '100%',
								}}
							></button>
						))}
						<span>
							{current}/{product.photos.length}
						</span>
					</div>
				</div>
			</div>
		</PopUpComponent>
	);
}
