/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatPrice } from '@/lib/utils';
import { ProductsMinType, StatusType } from '@/services/api/product_categorie';
import { useDeleteProductMutation } from '@/utils/queryOptions';
import { Link } from '@tanstack/react-router';
import {
	BadgeX,
	Eye,
	Loader2,
	MessageSquare,
	Pause,
	Rocket,
	Share2,
	SquarePen,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';

// import { get_caracteristique_child } from '@/utils/mock/Menucaegorie';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import clsx from 'clsx';
import ActionFavourite from '../../ui/ActionFavourite';
import ModalBoostAnnouce from '../../ui/ModalBoostAnnouce';
import ModalConfirmation from '../../ui/ModalConfirmation';
import ModalEditProduct from '../../ui/ModalEditProduct';
import FeatureComponent from '../FeatureComponent';
import ImgComponent from './componentAdd/ImgComponent';
const size_icon = 16;
const className = {
	actionButton:
		'flex flex-row items-center justify-center gap-1 border bg-white border-slate-100 p-1 rounded-md text-black',
	text: 'text-xs',
};

export default function LayoutProduct1({ products }: { products: ProductsMinType }) {
	return (
		<div className="w-full  ">
			{products.map((product) => (
				<ItemProduct key={product.product_id} product={product} />
			))}
		</div>
	);
}

const ItemProduct = ({ product }: { product: ProductsMinType[0] }) => {
	const [modalConfirm, setModalConfirm] = useState(false);
	const [showModalBoost, setShowModalBoost] = useState(false);
	const mutation = useDeleteProductMutation();

	const openModalBoost = (e: any) => {
		e.preventDefault();
		setShowModalBoost(true);
		document.body.style.overflow = 'hidden';
	};

	const closeModalBoost = () => {
		setShowModalBoost(false);
		document.body.style.overflow = 'auto';
	};
	const openModalConfirm = (e: any) => {
		e.preventDefault();
		setModalConfirm(true);
		document.body.style.overflow = 'hidden';
	};
	const closeModalConfirm = () => {
		setModalConfirm(false);
		document.body.style.overflow = 'auto';
	};
	const setFiles = useInputCategorie((state) => state.setFile);

	const [showPopUp, setShowPopUp] = useState(false);
	const openPopUp = useCallback((e: any) => {
		e.preventDefault();
		setShowPopUp(true);
		// const characteristics = get_caracteristique_child(product.category_id, data);
		// const mergedArray = characteristics.reduce((acc, curr) => acc.concat(curr), []);
		// setFieldCharac(mergedArray);
		setFiles(product.photos);
		document.body.style.overflow = 'hidden';
	}, []);

	const closePopUp = useCallback(() => {
		setShowPopUp(false);
		document.body.style.overflow = 'auto';
	}, []);

	// const router = createRouter({});
	const deleteAnnounce = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		mutation.mutate(product.product_id);
	};
	const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
	const [fade, setFade] = useState(true);
	const handleImageChange = (index: number) => {
		if (index === currentImageIndex) return;
		setFade(false);
		setTimeout(() => {
			setCurrentImageIndex(index);
			setFade(true);
		}, 300);
	};
	const translateStatus = (status: StatusType) => {
		switch (status) {
			case 'AWAIT':
				return {
					text: 'En attente de validation',
					color: 'text-yellow-700 bg-yellow-400',
					info: 'Temps de traitement : moins de 5 minutes',
				};
			case 'VALID':
				return {
					text: 'Validée',
					color: 'text-green-700 bg-green-400',
					info: '',
				};
			case 'REJECTED':
				return {
					text: 'Rejetée',
					color: 'text-red-700 bg-red-400',
					info: 'Votre annonce a été rejetée',
				};
			case 'DELETED':
				return {
					text: 'Supprimée',
					color: 'text-red-700 bg-red-400',
					info: 'Ton annonce a été supprimée',
				};
			case 'PAUSE':
				return {
					text: 'En pause',
					color: 'text-gray-700 bg-gray-400',
					info: '',
				};
			default:
				return {
					text: 'En attente',
					color: 'text-gray-700 bg-gray-400',
					info: '',
				};
		}
	};
	return (
		<div className="w-full">
			<Link
				to={`/product/$productId`}
				params={{ productId: product.product_id }}
				key={product.product_id}
				className="group my-2 flex h-[240px] max-w-[80%]  flex-col  border-b-2 border-slate-200 bg-slate-100/10 p-1"
			>
				<div className="flex w-full flex-1 flex-col border-slate-200">
					<div className="flex size-full gap-2 py-1 pl-1">
						<ImgComponent
							photos={product.photos}
							title={product.title}
							style="col-start-1 col-end-5 w-[40%] h-[210px]"
						>
							<>
								<ActionFavourite
									key={product.product_id}
									productId={product.product_id}
									style={
										'absolute  opacity-0 right-3 top-3 transition-all duration-300 group-hover:opacity-100 '
									}
								/>
								<div className="absolute inset-x-0 bottom-0 flex justify-center  gap-x-6 bg-slate-950 font-sans opacity-0  transition-all duration-500  group-hover:opacity-100">
									<div
										title="nombre de vue sur l'annonce"
										className="flex flex-row items-center justify-center gap-1 text-white"
									>
										<span className="">0</span>
										<Eye size={size_icon} />
									</div>
									<div
										title="nombre de conversation sur l'annonce"
										className="flex flex-row items-center justify-center gap-1 text-white"
									>
										<span className="">0</span>
										<MessageSquare size={size_icon} />
									</div>
									<div
										title="nombre de partage sur l'annonce"
										className="flex flex-row items-center justify-center gap-1 text-white"
									>
										<span className="">0</span>
										<Share2 size={size_icon} />
									</div>
								</div>
							</>
						</ImgComponent>

						<div className={`flex size-full flex-col gap-2 p-1`}>
							<div className="flex h-full flex-col gap-1">
								<span className="text-lg text-stone-950">{product.title}</span>
								<span className="font-roboto text-base text-stone-950">{formatPrice(product.price)}</span>
							</div>
							<FeatureComponent productId={product.product_id} />
							<div className="flex flex-col justify-between gap-y-6">
								<div className={clsx('flex flex-row flex-wrap items-center justify-between')}>
									<button
										title="Booster votre annonce"
										className={twMerge([
											className.actionButton,
											'border-slate-40 bg-yellow-400 hover:bg-yellow-300',
											product.status === 'AWAIT' && 'hidden',
										])}
										onClick={openModalBoost}
									>
										<Rocket size={size_icon} />
										<span className={className.text}>Booster</span>
									</button>

									<button
										className={twMerge([
											className.actionButton,
											'border-blue-400 hover:bg-slate-500 ',
											product.status === 'AWAIT' && 'hidden',
										])}
										onClick={(e) => openPopUp(e)}
									>
										<SquarePen size={size_icon} />
										<span className={className.text}>Modifier</span>
									</button>
									<button
										className={twMerge([
											className.actionButton,
											'border-slate-40 hover:bg-slate-200 text-black ',
											product.status === 'AWAIT' && 'hidden',
										])}
									>
										<Pause size={size_icon} />
										<span className={className.text}>Mettre en pause</span>
									</button>
									<button
										title="Supprimer votre annonce"
										onClick={openModalConfirm}
										className={twMerge([
											className.actionButton,
											'bg-red-400 hover:bg-red-600',
											product.status === 'AWAIT' && 'hidden',
										])}
									>
										{mutation.isPending ? (
											<>
												<Loader2 className="animate-spin" size={size_icon} />
												<span className={twMerge([className.text, ''])}>Suppression</span>
											</>
										) : (
											<>
												<BadgeX size={size_icon} />
												<span className={className.text}>Supprimer</span>
											</>
										)}
									</button>
								</div>
								<div className="flex flex-col items-center">
									{/* <span className="font-roboto text-xs text-gray-900 shadow-sm">
										{formatDate(product.product_created_at)}
									</span> */}
									<span className="py-1 text-xs text-gray-900 shadow-sm">
										{translateStatus(product.status).info}{' '}
									</span>
									<span
										className={clsx(
											'mx-1 rounded-xl p-1 text-center font-roboto text-xs text-gray-900 shadow-sm',
											{
												'text-yellow-700 bg-yellow-400': product.status === 'AWAIT',
												'text-green-700 bg-green-400': product.status === 'VALID',
											}
										)}
									>
										{translateStatus(product.status).text}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Link>

			<ModalEditProduct product={product} closePopUp={closePopUp} showPopUp={showPopUp} />
			<ModalConfirmation
				closePopUp={closeModalConfirm}
				showPopUp={modalConfirm}
				message={"Voulez vous supprimez l'annnoce"}
				confirm={deleteAnnounce}
			/>
			<ModalBoostAnnouce
				closePopUp={closeModalBoost}
				showPopUp={showModalBoost}
				product={product}
				// confirm={boostAnnounce}
			/>
		</div>
	);
};

// const
