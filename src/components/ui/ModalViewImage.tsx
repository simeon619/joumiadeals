/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { ProductDetailType } from '@/services/api/product_categorie';
import { URL_IMAGE } from '@/utils/constante';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import PopUpComponent from './PopUpComponent';
export default function ModalViewImage({
	showPopUp,
	closePopUp,
	product,
	api,
	setApi,
	current,
}: {
	showPopUp: boolean;
	closePopUp: () => void;
	product: ProductDetailType;
	api: any;
	setApi: any;
	current: number;
}) {
	// const [current, setCurrent] = useState(0);
	// const [api, setApi] = useState<CarouselApi>();

	return (
		<PopUpComponent
			styleContainer="relative bg-white flex items-center size-full justify-start"
			isOpen={showPopUp}
			// setHide={closePopUp}
		>
			<button onClick={() => closePopUp()}>
				<X
					role="img"
					aria-label="close"
					className="absolute right-2 top-2 z-10 size-7 rounded-full border  bg-white text-red-600"
				/>
			</button>
			<div className="mx-[180px] grid w-full grid-cols-3">
				<Carousel
					setApi={setApi}
					className="col-start-1 col-end-3 flex w-full items-center justify-center "
				>
					<CarouselContent>
						{product.photos.map((image, index) => (
							<CarouselItem key={index}>
								<div className="aspect-[4/3] h-[500px] w-[80%] rounded-sm">
									<img
										aria-label="product image"
										className="size-full bg-center bg-no-repeat object-cover"
										src={`${URL_IMAGE}${image}`}
										alt="Product"
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="-ml-10" />
					<CarouselNext className="-mr-10" />
				</Carousel>
				<div className="col-start-3 col-end-4 flex flex-col justify-start gap-2 px-3">
					<span className="text-xs">
						{current}/{product.photos.length}
					</span>
					<span className="text-xl">{product.title}</span>
					<div className="flex flex-wrap items-stretch justify-start gap-3 ">
						{product.photos.map((image, index) => (
							<button
								onClick={() => {
									api?.scrollTo(index);
								}}
								key={index}
								aria-label="product image"
								className={twMerge(
									'rounded-sm bg-contain bg-center bg-no-repeat size-[90px] border',
									current === index + 1 ? 'bg-primary/10' : ''
								)}
								style={{
									backgroundImage: `url(${URL_IMAGE}${image})`,
								}}
							></button>
						))}
					</div>
				</div>
			</div>
		</PopUpComponent>
	);
}
