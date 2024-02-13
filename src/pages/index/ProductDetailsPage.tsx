// import { useRouter } from "@tanstack/react-router"
import PopUpComponent from '@/components/ui/PopUpComponent';
import { productDetailsRoot } from '@/lib/route';
import { formatDate } from '@/utils/formating';
import { products } from '@/utils/mock/product';
import { Heart, MessageSquareText, Phone, Share2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from '@/components/ui/carousel';
export default function ProductDetailPage() {
	const { productId } = productDetailsRoot.useParams();
	const [showPopUp, setShowPopUp] = useState(false);
	const openPopUp = () => {
		setShowPopUp(true);
		document.body.style.overflow = 'hidden';
	};
	const closePopUp = () => {
		setShowPopUp(false);
		document.body.style.overflow = 'auto';
	};
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on('select', () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);
	const product = products.find((product) => product._id === productId);
	const images = useMemo(() => {
		if (product && product?.images.length > 3) {
			return [product.images[0], product.images[1], product.images[2]];
		} else {
			return product?.images;
		}
	}, [product]);
	if (!product) return null;

	function formatPrice(price: number) {
		return price.toLocaleString('fr-FR', {
			style: 'currency',
			currency: 'CFA',
		});
	}
	return (
		<>
			<div className={`mt-5`}>
				<div className={`grid  grid-cols-12 gap-x-2`}>
					<div className={`relative col-start-1 col-end-9`}>
						<div className={`flex h-full items-center justify-center gap-x-1`}>
							{images?.map((image, i) => {
								return (
									<div
										aria-label="product image"
										className={`group flex justify-center rounded-sm bg-slate-950 bg-cover bg-center bg-no-repeat`}
										style={{
											backgroundImage: `url(${image})`,
											width: '100%',
											height: '100%',
										}}
										role="img"
										key={i}
									></div>
								);
							})}
							<button
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									openPopUp();
								}}
								className="absolute left-3 top-3 flex flex-col items-center justify-between rounded-md border border-slate-600 bg-white px-2 py-1 hover:text-slate-600"
							>
								<span className={`text-sm font-semibold`}> Voir les autres </span>
							</button>
							<div className={`absolute right-3 top-3 flex flex-row gap-x-3`}>
								<button
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										console.log(product);
									}}
									className=" flex flex-col items-center justify-between rounded-xl border border-slate-600 bg-white px-2 py-1 hover:text-slate-600"
								>
									<Share2 role="img" aria-label="share" />
								</button>
								<button
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										console.log(product);
									}}
									className=" flex flex-col items-center justify-between rounded-xl border border-slate-600 bg-white px-2 py-1 hover:text-slate-600"
								>
									<Heart role="img" aria-label="heart" />
								</button>
							</div>
						</div>
					</div>
					<div className={`col-start-9 col-end-13`}>
						<div className="m-3 shadow-md">
							<button className="flex flex-row items-center gap-x-4  p-4">
								<img src={product.avatar} className="size-14 rounded-full" alt="" />
								<div className={`flex flex-col items-start gap-y-2`}>
									<div className={`flex flex-col items-start`}>
										<span className="">{product.fullName}</span>
										<span className={`text-xs `}>{product.localisation}</span>
									</div>
									<span className={`text-xs underline`}>Membre depuis {formatDate(product.date)}</span>
								</div>
							</button>
							<div>
								<div className="flex flex-col gap-y-2 p-5">
									<p>Contactez via</p>
									<div className={`flex items-center gap-x-2 rounded-md bg-slate-600 px-8 py-2`}>
										<img
											src={'/svg/whatsapp.svg'}
											alt="message via whatsapp"
											className={`size-7 bg-cover bg-center bg-no-repeat text-white`}
										/>
										<span className={`text-white`}>Whatsapp</span>
									</div>
									<div className={`flex gap-x-2 rounded-md bg-green-600 px-8 py-2`}>
										<Phone color="white" />
										<span className={` text-white`}>Telephone</span>
									</div>
									<div className={`flex gap-x-2 rounded-md bg-blue px-8 py-2`}>
										<MessageSquareText color="white" />
										<span className={` text-white`}>Message Direct</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={`mt-1 grid grid-cols-12`}>
					<div className={`col-start-1 col-end-9 h-full`}>
						<div className={`flex  flex-col gap-y-3`}>
							<div className={`flex flex-col gap-y-1 py-3`}>
								<div className={`flex items-baseline gap-x-2`}>
									<h1 className={`text-xl`}>{product.title}</h1>
									<span className="text-xs  font-light text-gray-500">{formatDate(product.date)}</span>
								</div>
								<div className={`flex flex-row items-center gap-x-1`}>
									<span>{formatPrice(Number(product.price))}</span>
									<span
										className={`rounded-md bg-slate-300 px-1 font-roboto text-[13px] font-light text-gray-600 shadow-sm`}
									>
										{product.statut}
									</span>
								</div>
							</div>
							<div>
								<h1 className={`text-lg font-semibold`}>Description</h1>
								<p className={`pt-1 text-base`}>{product.description}</p>
							</div>
							<div className={``}>
								<h1 className={`text-lg font-semibold`}>Caractéristique</h1>
							</div>
						</div>
					</div>

					<div className={`col-start-9 col-end-13`}></div>
				</div>
			</div>

			<PopUpComponent styleContainer="relative h-full w-full " isOpen={showPopUp}>
				<div className={`absolute inset-0 bg-white `}>
					<button onClick={() => closePopUp()}>
						<X role="img" aria-label="close" className="absolute left-2 top-2 size-7 text-red-600" />
					</button>
					<div className="grid grid-rows-12">
						<div className="row-start-1 row-end-10 flex flex-col items-center ">
							<Carousel setApi={setApi} className="max-w-[900px] ">
								<CarouselContent>
									{product.images.map((image, index) => (
										<CarouselItem key={index} className="size-[700px]">
											<div
												aria-label="product image"
												className={`group flex justify-center rounded-sm bg-contain bg-center bg-no-repeat`}
												style={{
													backgroundImage: `url(${image})`,
													width: '100%',
													height: '100%',
												}}
												role="img"
												key={index}
											></div>
										</CarouselItem>
									))}
								</CarouselContent>
								<CarouselPrevious />
								<CarouselNext />
							</Carousel>
						</div>
						<div className="row-start-11 row-end-13 bg-red-700">
							Slide {current} of {count}
						</div>
					</div>
				</div>
			</PopUpComponent>
		</>
	);
}
