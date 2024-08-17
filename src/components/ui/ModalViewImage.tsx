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
		<PopUpComponent styleContainer=" h-full w-full overflow-auto" isOpen={showPopUp}>
			<div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 dark:bg-white/80">
				<Carousel
					setApi={setApi}
					className="relative min-h-[300px] w-2/3 min-w-[300px] max-w-[800px] bg-slate-50 py-5"
				>
					<button onClick={() => closePopUp()}>
						<X
							role="img"
							aria-label="close"
							className="absolute left-2 top-2 z-10 size-7 rounded-full border  bg-white text-red-600"
						/>
					</button>
					<CarouselContent>
						{product.photos.map((image, index) => (
							<CarouselItem key={index}>
								<div
									aria-label="product image"
									className="h-[70vw] w-full rounded-sm bg-contain bg-center bg-no-repeat sm:h-[50vw] md:h-[40vw] lg:h-[30vw] xl:h-[25vw] 2xl:h-[20vw]"
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
					<div className="flex h-40 items-stretch justify-center gap-x-1">
						{product.photos.map((image, index) => (
							<button
								onClick={() => {
									api?.scrollTo(index);
								}}
								key={index}
								aria-label="product image"
								className={twMerge(
									'rounded-sm bg-contain bg-center bg-no-repeat size-[60px] border',
									current === index + 1 ? 'bg-primary/10' : ''
								)}
								style={{
									backgroundImage: `url(${URL_IMAGE}${image})`,
									// width: '100px',
									// height: '100px',
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
