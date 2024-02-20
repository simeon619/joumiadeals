// import { useRouter } from "@tanstack/react-router"
import { productDetailsRoot } from '@/lib/route';
import { formatDate } from '@/utils/formating';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Expand, MessageSquareText, Phone, Share2, X } from 'lucide-react';
import { Suspense, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { getProductOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { URL_IMAGE } from '@/utils/constante';
import { formatPrice } from '@/lib/utils';
import ActionFavourite from '@/components/ui/ActionFavourite';

import ModalViewImage from '@/components/ui/ModalViewImage';
import ModalReport from '@/components/ui/ModalReport';
const shareText = 'Check out this awesome content!';
const shareUrl = 'https://yourwebsite.com/awesome-content';

export default function ProductDetailPage() {
	const { productId } = productDetailsRoot.useParams();
	const { data: productPromise } = useSuspenseQuery(getProductOptions(productId));
	const product = useDeferredValue(productPromise);

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
						<div className={`flex h-full items-center justify-center gap-x-1`}>
							{images?.map((image, i) => {
								return (
									<button
										onClick={(e) => {
											e.preventDefault();
											openPopUp(i);
										}}
										aria-label="product image"
										className={`group flex justify-center rounded-sm bg-gray-50 bg-contain bg-center bg-no-repeat`}
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
								className="absolute left-3 top-3 flex flex-col items-center justify-between rounded-md bg-gray-400 px-2 py-1 hover:text-slate-600"
							>
								<Expand role="img" aria-label="expand" size={20} color={'white'} />
								{/* <span> Voir les autres </span> */}
							</button>
							<div className={`absolute right-3 top-3 flex flex-row gap-x-3`}>
								<Popover>
									<PopoverTrigger className=" flex flex-col items-center justify-between rounded-xl   bg-gray-400  px-2 py-1 hover:text-slate-600">
										<Share2 color="white" role="img" aria-label="share" />
									</PopoverTrigger>
									<PopoverContent className="max-w-80">
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
										'flex flex-col items-center  justify-between rounded-xl   bg-gray-400   px-2 py-1 hover:text-slate-600'
									}
								/>
							</div>
						</div>
					</div>
					<div className={`col-start-9 col-end-13`}>
						<div className="m-3 shadow-md">
							<button className="flex flex-row items-center gap-x-4  p-4">
								<img src={product.provider.avatar_url} className="size-14 rounded-full" alt="" />
								<div className={`flex flex-col items-start gap-y-2`}>
									<div className={`flex flex-col items-start`}>
										<span className="">{product.provider.name}</span>
										<span className={`text-xs `}>{product.provider.location}</span>
									</div>
									<span className={`text-xs underline`}>
										Membre depuis {formatDate(product.provider.created_at)}
									</span>
								</div>
							</button>
							<div>
								<div className="flex flex-col gap-y-2 p-5">
									<p>Contactez via</p>
									{product.provider.phone && (
										<div className={`flex items-center gap-x-2 rounded-md bg-slate-600 px-8 py-2`}>
											<img
												src={'/img/WhatsApp.webp'}
												alt=""
												className={`size-7 bg-cover bg-center bg-no-repeat text-white`}
											/>
											<a
												href={`https://wa.me/${product.provider.phone}?text=${encodeURIComponent(shareText)}%20${encodeURIComponent(shareUrl)}`}
												target="_blank"
												rel="noreferrer"
												className={`text-white`}
											>
												Whatsapp
											</a>
										</div>
									)}
									<div className={`flex gap-x-2 rounded-md bg-green-600 px-8 py-2`}>
										<Phone color="white" />
										<span className={` text-white`}>Telephone</span>
									</div>
									<div className={`flex gap-x-2 rounded-md bg-primary px-8 py-2`}>
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
									<span className="text-xs  font-light text-gray-500">{formatDate(product.created_at)}</span>
								</div>
								<div className={`flex flex-row items-center gap-x-1`}>
									<span>{formatPrice(Number(product.price))}</span>
									<span
										className={`rounded-md bg-slate-300 px-1 font-roboto text-[13px] font-light text-gray-600 shadow-sm`}
									>
										{product.status}
									</span>
								</div>
							</div>
							<div>
								<h1 className={`text-base `}>Description</h1>
								<pre className={`pt-1 text-base`}>{product.description}</pre>
							</div>
							<div className={`py-2`}>
								<h1 className={`text-base`}>Caractéristique</h1>
								<div className={`flex flex-wrap gap-x-3 py-1`}>
									{Object.keys(JSON.parse(product.caracteristique)).map((key) => {
										return (
											<div key={key} className={'text-sm text-gray-800'}>
												<span className={`font-semibold`}>{key}:</span>
												<span className={`font-light`}>{JSON.parse(product.caracteristique)[key]} </span>
											</div>
										);
									})}
								</div>
							</div>
							<div>
								<button onClick={() => openModalReport()} className={`text-xs	underline`}>
									signalez l&apos;annonce
								</button>
							</div>
						</div>
					</div>
					<div className={`col-start-9 col-end-13`}></div>
				</div>
			</div>
			<ModalViewImage showPopUp={showPopUp} product={product} closePopUp={closePopUp} />
			<ModalReport showPopUp={modalReport} productId={product.id} closePopUp={closeModalReport} />
		</Suspense>
	);
}
