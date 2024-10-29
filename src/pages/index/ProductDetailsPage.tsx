/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useRouter } from "@tanstack/react-router"
import ActionFavourite from '@/components/ui/ActionFavourite';
import { type CarouselApi } from '@/components/ui/carousel';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { discussionRoot, productDetailsRoot, productsOtherRoot } from '@/lib/route';
import { formatPrice, getUrlImage } from '@/lib/utils';
import { URL_IMAGE } from '@/utils/constante';
import { formatDate } from '@/utils/formating';
import {
	getFeatureProductOptions,
	getProductOptions,
	useAddVisitedProductMutation,
	useCreateDiscussionMutaton,
} from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
	ArrowLeft,
	BadgeInfo,
	ChevronRight,
	Flag,
	HandCoins,
	MessageSquareText,
	Phone,
	Share2,
	UserCheck,
} from 'lucide-react';
import { Suspense, useDeferredValue, useEffect, useMemo, useState } from 'react';

import SimilaireProduct from '@/components/product/similaire/SimilaireProduct';
import OnScrollTop from '@/components/root/OnScrollTop';
import ModalReport from '@/components/ui/ModalReport';
import ModalViewImage from '@/components/ui/ModalViewImage';
import { useAuth } from '@/services/state/User/auth';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useSwipeable } from 'react-swipeable';
import { useTitle } from 'react-use';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Wrap1 from '../_layout/Wrap1';

// Import Swiper styles
import clsx from 'clsx';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function ProductDetailPage() {
	const { productId } = productDetailsRoot.useParams();

	const { data: productPromise } = useSuspenseQuery(getProductOptions(productId));
	const { mutate, isSuccess, isPending } = useCreateDiscussionMutaton();
	const { mutate: addVisitedProduct } = useAddVisitedProductMutation();
	const { data: features } = useSuspenseQuery(getFeatureProductOptions(productId));
	const navigate = useNavigate();
	const product = useDeferredValue(productPromise);
	const [current, setCurrent] = useState(0);
	const [api, setApi] = useState<CarouselApi>();
	const isAuth = useAuth((s) => s.isAuth);
	const shareText = `http://127.0.0.1:5173/product/${product.id}\t 
	Bonjour  Mr/Mme ${product.provider.name},\t
	Je suis intéressé(e) par votre annonce publiée sur Amedeals 
	${product.title} au prix de ${product.price} CFA .\t 
	Pouvez-vous me donner plus de détails ? \t Merci de me repondre au plus vite.`;
	const shareUrl = ``;
	useEffect(() => {
		if (isAuth) {
			// addVisitedProduct({ product_id: productId });
		}
	}, [addVisitedProduct, isAuth, productId]);

	useTitle(productPromise.title);
	const [currentIndex, setCurrentIndex] = useState(0);
	const { history } = useRouter();
	const handleSwipe = (dir: string) => {
		if (dir === 'LEFT') {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % product?.photos?.length);
		} else if (dir === 'RIGHT') {
			setCurrentIndex((prevIndex) => (prevIndex === 0 ? product?.photos?.length - 1 : prevIndex - 1));
		}
	};

	const handlers = useSwipeable({
		onSwipedLeft: () => handleSwipe('LEFT'),
		onSwipedRight: () => handleSwipe('RIGHT'),
		...{
			delta: 10, // min distance(px) before a swipe starts. *See Notes*
			preventScrollOnSwipe: false, // prevents scroll during swipe (*See Details*)
			trackTouch: true, // track touch input
			trackMouse: false, // track mouse input
			rotationAngle: 0, // set a rotation angle
			swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
			touchEventOptions: { passive: true }, // options for touch listeners (*See Details*)
		},
	});

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

	const [showPopUp, setShowPopUp] = useState(false);
	const openPopUp = (i?: number) => {
		setShowPopUp(true);
		document.body.style.overflow = 'hidden';
		const timeOut = setTimeout(() => {
			// @ts-expect-error api is not typed
			api?.scrollTo(i);
		}, 10);
		return () => {
			clearTimeout(timeOut);
		};
	};
	const closePopUp = () => {
		setShowPopUp(false);
		document.body.style.overflow = 'visible';
	};

	const [modalReport, setModalReport] = useState(false);

	const openModalReport = () => {
		setModalReport(true);
		document.body.style.overflow = 'hidden';
	};
	const closeModalReport = () => {
		setModalReport(false);
		document.body.style.overflow = 'visible';
	};

	const handleCreateMessage = (e: { preventDefault: () => void }) => {
		e.preventDefault();
		mutate({ product_id: productId, type: 'personal', account_id: product.account_id });
	};
	if (isSuccess) {
		navigate({
			to: discussionRoot.to,
			search: {
				filter: { type: 'private' },
				provider_id: product.provider.id,
				product_id: product.id,
			},
		});
	}

	const images = useMemo(() => {
		if (product && product?.photos.length >= 3) {
			return [product.photos[0], product.photos[1], product.photos[2]];
		} else {
			return product?.photos;
		}
	}, [product]);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className={`mt-16 overflow-x-hidden md:mt-0`}>
				<div>
					<OnScrollTop>
						<Wrap1
							child={
								<div className="flex items-start justify-between gap-2 bg-white px-5 pb-4 pt-1 shadow-lg md:pb-1 lg:w-screen lg:pt-2">
									<div className="flex  items-start justify-center gap-2">
										<img
											src={getUrlImage(images[0])}
											loading="lazy"
											className="size-[50px] sm:size-[40px]"
											alt=""
										/>
										<div className="flex w-full flex-col items-start justify-center">
											<h1 className={`line-clamp-1 font-roboto text-xl md:text-sm`}>{product.title}</h1>
											<div className="flex flex-row items-end justify-center gap-1">
												<span className={`font-mono text-lg font-bold text-green-600`}>
													{formatPrice(Number(product.price))}
												</span>
												<HandCoins color="green" size={14} />
											</div>
										</div>
									</div>
									<div className={'sm:hidden'}>
										<p className={`text-[.71rem] font-bold`}>Contactez via :</p>
										<SocialComp
											phone={product.provider.phone}
											shareText={shareText}
											handleCreateMessage={handleCreateMessage}
										/>
									</div>
									<ActionFavourite size={22} style="border-none" productId={product.id} />
								</div>
							}
							style="bg-white"
						/>
					</OnScrollTop>
					<div className={`flex w-full gap-x-2`}>
						<div
							className={`relative flex size-full items-start justify-center gap-x-1 rounded-md border bg-gray-400 md:bg-white`}
						>
							<div className="relative flex  md:hidden">
								{images?.map((image, i) => {
									return (
										<button
											onClick={(e) => {
												e.preventDefault();
												openPopUp(i);
											}}
											aria-label="product image"
											className={`group flex h-[320px] w-[340px] justify-center rounded-sm bg-gray-500 bg-cover bg-center bg-no-repeat`}
											style={{
												backgroundImage: `url(${URL_IMAGE}${image})`,
											}}
											key={i}
										></button>
									);
								})}
								<button
									onClick={(e) => {
										e.preventDefault();
										openPopUp();
									}}
									className="absolute bottom-3 flex rounded-md border bg-white px-2 py-[1px] hover:text-slate-600"
								>
									<span className="text-xs">
										Voir {images?.length} photo{images?.length > 1 ? 's' : ''}
									</span>
								</button>
							</div>
							<div className="hidden w-full justify-center bg-gray-100 xs:h-full md:block">
								<Swiper
									modules={[Navigation, Pagination, Scrollbar, A11y]}
									autoHeight={true}
									style={{
										'--swiper-navigation-color': '#000',
										'--swiper-pagination-color': '#028',
									}}
									zoom={true}
									lazy={true}
									mousewheel={true}
									slidesPerView={1}
									spaceBetween={30}
									preventClicksPropagation={true}
									preventClicks={true}
									// spaceBetween={12}
									pagination={{ clickable: true, dynamicBullets: true }}
									scrollbar={{ draggable: true }}
									className="relative size-full"
								>
									{product?.photos.map((i, index) => (
										<SwiperSlide key={index}>
											<img
												src={`${URL_IMAGE}${i}`}
												alt={product?.title}
												className={clsx(
													` size-full rounded-md bg-cover bg-center bg-no-repeat object-cover transition-all duration-500`
												)}
												loading="lazy"
												onError={(e) => {
													e.currentTarget.src = '/img/imgError.png';
												}}
											/>
											<div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
										</SwiperSlide>
									))}
									<div className={`absolute right-3 top-3 z-100 flex flex-row gap-x-3`}>
										<Popover>
											<PopoverTrigger className=" flex flex-col items-center justify-between rounded-xl border bg-white p-1 hover:text-slate-600">
												<Share2 color="gray" size={20} role="img" aria-label="share" />
											</PopoverTrigger>
											<PopoverContent className="max-w-fit">
												<div className="grid gap-4">
													<div className="grid gap-2">
														<h1>partagez l&apos;annonce </h1>
														<a
															className="text-primary"
															href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}%20${encodeURIComponent(shareUrl)}`}
															target="_blank"
															rel="noreferrer"
														>
															Tweeter
														</a>
														<a
															className="text-primary"
															href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
															target="_blank"
															rel="noreferrer"
														>
															Facebook
														</a>
														<a
															className="text-primary"
															href={`https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}%20${encodeURIComponent(shareUrl)}`}
															target="_blank"
															rel="noreferrer"
														>
															Whatsapp
														</a>
													</div>
												</div>
											</PopoverContent>
										</Popover>
										<ActionFavourite
											key={product.id}
											productId={product.id}
											style={
												'flex flex-col items-center justify-between rounded-xl bg-gray-400 px-2 py-1 hover:text-slate-600'
											}
										/>
									</div>
									<ArrowLeft
										color="gray"
										onClick={() => {
											history.back();
										}}
										size={28}
										className="absolute left-4 top-3 z-100 hidden rounded-full border bg-white md:block"
									/>
								</Swiper>
							</div>

							<div className={`absolute right-3 top-3 flex flex-row gap-x-3`}>
								<Popover>
									<PopoverTrigger className=" flex flex-col items-center justify-between rounded-xl border bg-white p-1 hover:text-slate-600">
										<Share2 color="gray" size={20} role="img" aria-label="share" />
									</PopoverTrigger>
									<PopoverContent className="max-w-fit">
										<div className="grid gap-4">
											<div className="grid gap-2">
												<h1>partagez l&apos;annonce </h1>
												<a
													className="text-primary"
													href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}%20${encodeURIComponent(shareUrl)}`}
													target="_blank"
													rel="noreferrer"
												>
													Tweeter
												</a>
												<a
													className="text-primary"
													href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
													target="_blank"
													rel="noreferrer"
												>
													Facebook
												</a>
												<a
													className="text-primary"
													href={`https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}%20${encodeURIComponent(shareUrl)}`}
													target="_blank"
													rel="noreferrer"
												>
													Whatsapp
												</a>
											</div>
										</div>
									</PopoverContent>
								</Popover>
								<ActionFavourite
									key={product.id}
									productId={product.id}
									style={
										'flex flex-col items-center justify-between rounded-xl bg-gray-400 px-2 py-1 hover:text-slate-600'
									}
								/>
							</div>
						</div>
						<div className="m-3 rounded-md border pb-3 hd:hidden">
							<button
								onClick={() =>
									navigate({
										to: productsOtherRoot.to,
										search: {
											provider_id: product.provider.id,
											filter: { status: 5 },
										},
									})
								}
								className="group flex w-[300px] flex-row items-center justify-center gap-2 bg-slate-200 py-2 hover:bg-slate-200"
							>
								<img
									src={getUrlImage(product.provider.avatar_url)}
									loading="lazy"
									className="size-[52px] rounded-full border border-black/60 shadow-lg"
									alt=""
								/>
								<div className={`flex flex-row items-center justify-between`}>
									<div className={`flex flex-col items-start`}>
										<div className={`flex flex-col items-start`}>
											<span className="line-clamp-1 text-[.79rem] font-bold">{product.provider.name}</span>
										</div>
										<span className={`flex items-baseline justify-center gap-1 text-xs text-gray-500`}>
											<UserCheck size={12} />
											Inscrit {formatDate(product.provider.created_at)}
										</span>
									</div>
									<ChevronRight
										size={20}
										className="text-gray-500 transition-all duration-300 group-hover:translate-x-[10px] group-hover:text-gray-900"
									/>
								</div>
							</button>
							<div className={''}>
								<p className={`px-4 py-2 text-[.75rem] font-bold`}>Contactez via :</p>
								<SocialComp
									phone={product.provider.phone}
									shareText={shareText}
									handleCreateMessage={handleCreateMessage}
								/>
							</div>
						</div>
					</div>
					<div className={`mt-4 h-full w-[60%] px-3 sm:w-full`}>
						<div className={`flex  flex-col gap-y-3`}>
							<div className={`flex flex-col items-baseline gap-3	`}>
								<div>
									<h1 className={`font-roboto  text-2xl text-slate-900 sm:text-lg`}>{product.title}</h1>
									<div className="flex flex-wrap items-start">
										{features.map((f, index) => {
											return (
												<>
													<span
														key={index}
														className="block font-bebasneue text-[.78rem] capitalize text-slate-950"
													>
														{f.value}
													</span>
													<span key={index} className="block px-[1px] text-green-950">
														{index !== features.length - 1 && ' • '}
													</span>
												</>
											);
										})}
									</div>
								</div>
								<div className="flex flex-row items-end justify-center gap-1">
									<span className={`font-mono text-xl font-bold text-green-600`}>
										{formatPrice(Number(product.price))}
									</span>
									<HandCoins color="green" size={14} />
								</div>
								<span className=" rounded-md  bg-slate-100 text-[.78rem] text-gray-600">
									{formatDate(product?.created_at)}
									{' • '}
									<span className={` text-sm`}>{product.provider.location}</span>
								</span>
							</div>
							<div className="my-3 hidden  border-y-[1px] hd:block">
								<button
									onClick={() =>
										navigate({
											to: productsOtherRoot.to,
											search: {
												provider_id: product.provider.id,
												filter: { status: 5 },
											},
										})
									}
									className="group flex w-full flex-row items-center justify-start gap-2 py-1"
								>
									<img
										src={getUrlImage(product.provider.avatar_url)}
										loading="lazy"
										className="size-[52px] rounded-full border border-black/60 shadow-lg"
										alt=""
									/>
									<div className={`flex w-full flex-row items-center justify-between`}>
										<div className={`flex flex-col items-start gap-y-2`}>
											<div className={`flex flex-col items-start`}>
												<span className="line-clamp-1 text-[.79rem] font-bold">{product.provider.name}</span>
											</div>
											<span className={`flex items-baseline justify-center gap-1 text-xs text-gray-500`}>
												<UserCheck size={12} />
												Inscrit {formatDate(product.provider.created_at)}
											</span>
										</div>
										<ChevronRight
											size={20}
											className="text-gray-500 transition-all duration-300 group-hover:translate-x-[10px] group-hover:text-gray-900"
										/>
									</div>
								</button>
							</div>
							<div>
								<div className="text-base font-bold text-slate-900 underline">Caracteristiques</div>
								<div className={`flex flex-wrap items-center gap-5 p-2`}>
									{features.map((f, index) => {
										return (
											<div key={index} className={'flex flex-row items-start gap-1  text-sm text-gray-800'}>
												<div className={` items-center rounded-full bg-slate-100 p-[.2rem]`}>
													<BadgeInfo size={18} strokeWidth={0.75} color="black" />
												</div>
												<span className={`flex flex-col gap-y-0.5 text-xs font-light`}>
													<span className={`capitalize text-gray-600`}>{f.name}</span>
													<span className={`text-[.78rem] capitalize text-slate-950`}>{f.value}</span>
												</span>
											</div>
										);
									})}
								</div>
							</div>
							<div>
								<h1 className="text-base font-bold text-slate-900 underline">Description</h1>
								<pre className={`whitespace-pre-wrap p-2 font-poppins text-[.85rem]`}>
									{product.description}
								</pre>
							</div>
							<hr />
							<div className="flex items-center justify-start gap-1">
								<Flag size={13} color="black" />
								<button onClick={() => openModalReport()} className={`font-roboto text-xs underline`}>
									signalez l&apos;annonce
								</button>
							</div>
						</div>
						<SimilaireProduct categoryId={product.category_id} />
					</div>
				</div>
				{/* <div className="absolute inset-x-0 bottom-0 h-[100px] bg-orange-500"></div> */}
			</div>
			<ModalViewImage
				showPopUp={showPopUp}
				product={product}
				closePopUp={closePopUp}
				api={api}
				setApi={setApi}
				current={current}
			/>
			<ModalReport showPopUp={modalReport} productId={product.id} closePopUp={closeModalReport} />
			<div className="h-[100px] w-full bg-transparent"></div>
			<div className="fixed inset-x-0 -bottom-0 z-90 hidden flex-wrap items-center justify-around border-t-2 bg-white px-2 pb-2 shadow-2xl sm:flex sm:justify-around">
				<div className="flex items-center justify-center rounded-md bg-blue-600 px-3 py-1 text-blue-50">
					Voir profile
				</div>
				<div>
					<p className={`text-[.7rem] font-bold`}>Contactez via :</p>
					<SocialComp
						phone={product.provider.phone}
						shareText={shareText}
						handleCreateMessage={handleCreateMessage}
					/>
				</div>
			</div>
		</Suspense>
	);
}

const SocialComp = ({
	phone,
	shareText,
	handleCreateMessage,
}: {
	phone: string;
	shareText: string;
	handleCreateMessage: any;
}) => {
	return (
		<div className="flex flex-row items-start justify-center gap-3 hd:gap-1">
			{phone && (
				<>
					<a
						href={`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(shareText)}`}
						target="_blank"
						rel="noreferrer"
						className="group relative flex items-center justify-center gap-x-1 rounded-md bg-green-600 p-2 text-white transition duration-300 hover:bg-green-700"
					>
						<div className="relative">
							<img
								src={'/img/whatsapp.png'}
								alt="WhatsApp"
								className="max-h-4 min-h-4 min-w-4 max-w-4  bg-cover bg-center bg-no-repeat text-white"
							/>
							<span className="absolute -bottom-6 -left-4 font-roboto text-[.0rem] text-black transition-all duration-300 group-hover:text-[.7rem]">
								WhatsApp
							</span>
						</div>
					</a>
					<a
						href={`https://t.me/${phone}?text=${encodeURIComponent(shareText)}`}
						target="_blank"
						rel="noreferrer"
						className="group relative  flex items-center justify-center gap-x-1 rounded-md bg-blue-600 p-2 text-white transition duration-300 hover:bg-blue-700"
					>
						<div className="relative">
							<img
								src={'/img/telegram.png'}
								alt="Telegram"
								className="max-h-4 min-h-4 min-w-4 max-w-4 bg-cover bg-center bg-no-repeat text-white"
							/>
							<span className="absolute -bottom-6 -left-5 font-roboto text-[.0rem] text-black  transition-all duration-300 group-hover:text-[.7rem]">
								Telegram
							</span>
						</div>
					</a>
				</>
			)}

			<a
				href={'tel:' + phone}
				className="group relative flex items-center justify-center gap-x-1 rounded-md bg-slate-600 p-2 text-white transition duration-300 hover:bg-slate-700"
			>
				<div className="relative">
					<Phone size={17} color="white" />
					<span className="absolute -bottom-6 -left-6 whitespace-nowrap font-roboto text-[.0rem] text-black transition-all duration-300 group-hover:text-[.7rem]">
						N° Telephone
					</span>
				</div>
			</a>

			<button
				onClick={handleCreateMessage}
				className="group relative flex items-center justify-center gap-x-1 rounded-md border p-2 transition duration-300 hover:border-gray-400"
			>
				<MessageSquareText color="#2F2E41" size={16} />
				<span className="absolute -bottom-5 font-roboto text-[.0rem] text-black  transition-all duration-300 group-hover:text-[.75rem] ">
					Message
				</span>
			</button>
		</div>
	);
};
