// import { useRouter } from "@tanstack/react-router"
import ActionFavourite from '@/components/ui/ActionFavourite';
import { type CarouselApi } from '@/components/ui/carousel';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { discussionRoot, productDetailsRoot, productsOtherRoot } from '@/lib/route';
import { formatPrice } from '@/lib/utils';
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
	BadgeInfo,
	ChevronRight,
	Flag,
	Loader2,
	MessageSquareText,
	Phone,
	Share2,
	UserCheck,
} from 'lucide-react';
import { Suspense, useDeferredValue, useEffect, useMemo, useState } from 'react';

import SimilaireProduct from '@/components/product/similaire/SimilaireProduct';
import ModalReport from '@/components/ui/ModalReport';
import ModalViewImage from '@/components/ui/ModalViewImage';
import { useAuth } from '@/services/state/User/auth';
import { useNavigate } from '@tanstack/react-router';
import { useTitle } from 'react-use';
const shareText = 'Check out this awesome content!';
const shareUrl = 'https://yourwebsite.com/awesome-content';

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

	useEffect(() => {
		if (isAuth) {
			addVisitedProduct({ product_id: productId });
		}
	}, [addVisitedProduct, isAuth, productId]);

	useTitle(productPromise.title);

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
			<div className={`mt-5 w-app self-center`}>
				<div className={`grid  grid-cols-12 gap-x-2`}>
					<div className={`relative col-start-1 col-end-9`}>
						<div className={`flex h-full items-center justify-center gap-x-1 rounded-md border p-[1px]`}>
							{images?.map((image, i) => {
								return (
									<button
										onClick={(e) => {
											e.preventDefault();
											openPopUp(i);
										}}
										aria-label="product image"
										className={`group flex justify-center rounded-sm bg-gray-50 bg-cover bg-center bg-no-repeat`}
										style={{
											backgroundImage: `url(${URL_IMAGE}${image})`,
											width: '100%',
											height: '100%',
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
								{/* <Expand role="img" aria-label="expand" size={20} color={'black'} /> */}
								<span className="text-xs">
									Voir {images?.length} photo{images?.length > 1 ? 's' : ''}
								</span>
							</button>
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
						<span className="absolute -bottom-5 left-0 rounded-md border bg-gray-500 px-2 text-sm text-white shadow-lg">
							{formatDate(product.created_at)} {'-'}
							<span className={` text-xs `}>{product.provider.location}</span>
						</span>
					</div>
					<div className={`col-start-9 col-end-13`}>
						<div className="m-3 rounded-md border">
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
								className="group flex w-full flex-row items-center justify-between p-4"
							>
								<img src={product.provider.avatar_url} className="size-14 rounded-full" alt="" />
								<div className={`flex flex-col items-start gap-y-2`}>
									<div className={`flex flex-col items-start`}>
										<span className="text-[.79rem] font-bold">{product.provider.name}</span>
									</div>
									<span className={`flex items-baseline justify-center  gap-1 text-xs text-gray-500`}>
										<UserCheck size={12} />
										Inscrit {formatDate(product.provider.created_at)}
									</span>
								</div>
								<ChevronRight size={20} className="text-gray-500 group-hover:text-gray-900" />
							</button>
							<div>
								<div className="flex flex-col gap-y-2 p-5">
									<p className={`text-[.75rem] font-bold`}>Contactez via :</p>
									{product.provider.phone && (
										<a
											href={`https://api.whatsapp.com/send?phone=+225${product.provider.phone}&text=${encodeURIComponent(shareText)}%20${encodeURIComponent(shareUrl)}`}
											target="_blank"
											rel="noreferrer"
											className={`flex items-center justify-center gap-x-2 rounded-md bg-slate-600 px-8 py-2 text-white`}
										>
											<img
												src={'/img/whatsapp.png'}
												alt=""
												className={`size-4 bg-cover bg-center bg-no-repeat text-white`}
											/>
											<span className={`text-[.85rem] text-white`}>Whatsapp</span>
										</a>
									)}
									<a
										href={'tel:+225' + product.provider.phone}
										className="flex items-center justify-center  gap-x-1 rounded-md bg-green-600 px-8 py-2 text-white"
									>
										<Phone size={17} color="white" />
										<span className={`text-[.85rem] text-white`}>N° Telephone</span>
									</a>
									<button
										onClick={handleCreateMessage}
										className={`flex items-center  justify-center gap-x-2 rounded-md border px-8 py-2 `}
									>
										{isPending ? (
											<Loader2 color="text-black" className="size-4 animate-spin" />
										) : (
											<MessageSquareText color="#2F2E41" size={18} />
										)}
										<span className={`text-[.8rem] text-black`}>Message direct</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={`mt-4 grid grid-cols-12`}>
					<div className={`col-start-1 col-end-9 h-full`}>
						<div className={`flex  flex-col gap-y-3`}>
							<div className={`flex flex-col gap-y-1 py-3`}>
								<div className={`flex flex-col items-baseline	`}>
									<h1 className={`font-roboto text-2xl`}>{product.title}</h1>
									<span className={`font-roboto text-lg text-slate-700`}>
										{formatPrice(Number(product.price))}
									</span>
								</div>
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
					<div className={`col-start-9 col-end-13`}></div>
				</div>
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
		</Suspense>
	);
}
