/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatPrice } from '@/lib/utils';
import { ProductsMinType } from '@/services/api/product_categorie';
import { URL_IMAGE } from '@/utils/constante';
import { formatDate } from '@/utils/formating';
import { getFeatureProductOptions, useDeleteProductMutation } from '@/utils/queryOptions';
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
import ActionFavourite from '../ui/ActionFavourite';
import ModalBoostAnnouce from '../ui/ModalBoostAnnouce';
import ModalConfirmation from '../ui/ModalConfirmation';
import ModalEditProduct from '../ui/ModalEditProduct';
import FeatureComponent from './FeatureComponent';
const size_icon = 16;
const className = {
	actionButton:
		'flex flex-row items-center justify-center gap-1 border bg-white border-slate-100 p-1 rounded-md text-black',
	text: 'text-xs',
};

export default function LayoutProduct1({ product }: { product: ProductsMinType[0] }) {
	const mutation = useDeleteProductMutation();
	
	// const route = useRouter();
	// const account = useAuth((state) => state.InfoUser);
	const [modalConfirm, setModalConfirm] = useState(false);
	const [showModalBoost, setShowModalBoost] = useState(false);

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
	return (
		<>
			<Link
				to={`/product/$productId`}
				params={{ productId: product.product_id }}
				key={product.product_id}
				className="my-2 grid h-[210px] grid-rows-10"
			>
				<div className="row-start-1 row-end-11 border-b-[1px] border-slate-200">
					<div className="grid h-full grid-cols-12 gap-2 py-1 pl-1">
						<div
							className={`group relative col-start-1 col-end-5 flex justify-center overflow-hidden rounded-md bg-slate-400 bg-cover bg-center bg-no-repeat`}
							style={{
								backgroundImage: `url(${URL_IMAGE}${product.photos[0]})`,
								width: '100%',
								height: '100%',
							}}
							role="img"
							aria-label={product.title}
						>
							{/* {!!product.express_time && (
								<span className="absolute -top-7 right-1 -z-10 rounded-sm bg-slate-200 px-3 pb-[15px] pt-1 text-sm font-semibold text-lime-700 transition-all duration-200 ease-linear group-hover:-top-8">
									Urgent
								</span>
							)} */}
							<ActionFavourite
								key={product.product_id}
								productId={product.product_id}
								style={
									'absolute  opacity-0 right-3 top-3 transition-all duration-300 group-hover:opacity-100 '
								}
							/>
							<div className="absolute inset-x-0 -bottom-10 flex  justify-center gap-x-6 bg-slate-950 font-sans  transition-all duration-300 group-hover:bottom-0">
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
						</div>
						<div className={`col-start-5 col-end-13 flex h-full flex-col gap-2 p-1`}>
							<div className="flex h-full flex-col gap-1">
								<span className="text-lg text-stone-950">{product.title}</span>
								<span className="font-roboto text-base text-stone-950">{formatPrice(product.price)}</span>
							</div>
							<FeatureComponent productId={product.product_id} />
							<div className="flex flex-col justify-between gap-y-6">
								<div className="flex flex-row flex-wrap items-center justify-between">
									<button
										title="Booster votre annonce"
										className={twMerge([
											className.actionButton,
											'border-slate-40 bg-yellow-400 hover:bg-yellow-300',
										])}
										onClick={openModalBoost}
									>
										<Rocket size={size_icon} />
										<span className={className.text}>Booster</span>
									</button>

									<button
										className={twMerge([className.actionButton, 'border-blue-400 hover:bg-slate-500 '])}
										onClick={(e) => openPopUp(e)}
									>
										<SquarePen size={size_icon} />
										<span className={className.text}>Modifier</span>
									</button>
									<button
										className={twMerge([
											className.actionButton,
											'border-slate-40 hover:bg-slate-200 text-black',
										])}
									>
										<Pause size={size_icon} />
										<span className={className.text}>Mettre en pause</span>
									</button>
									<button
										title="Supprimer votre annonce"
										onClick={openModalConfirm}
										className={twMerge([className.actionButton, 'bg-red-400 hover:bg-red-600'])}
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
								<span className="font-roboto text-xs text-gray-900 shadow-sm">
									{formatDate(product.product_created_at)}
								</span>
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
		</>
	);
}
