/* eslint-disable @typescript-eslint/no-explicit-any */
import ModalBoostAnnouce from '@/components/ui/ModalBoostAnnouce';
import ModalConfirmation from '@/components/ui/ModalConfirmation';
import ModalEditProduct from '@/components/ui/ModalEditProduct';
import { formatPrice } from '@/lib/utils';
import { ProductsMinType, StatusType } from '@/services/api/product_categorie';
import { formatDate } from '@/utils/formating';
import { useUpdateMutationproductStatus } from '@/utils/queryOptions';
import clsx from 'clsx';
import {
	BadgeX,
	Eye,
	MessageSquare,
	Pause,
	PlayCircle,
	Rocket,
	Share2,
	SquarePen,
} from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import FeatureComponent from '../../FeatureComponent';
type ActionType = 'boost' | 'repost' | 'pause' | 'delete' | 'ras';

const size_icon = 15;
const className = {
	actionButton:
		'flex flex-row items-center justify-center gap-1 border bg-white border-slate-100 p-1 rounded-md text-black',
	text: 'text-xs',
	containStyle: 'flex size-full flex-col items-start justify-between gap-4 rounded-lg bg-white',
};
export default function ContainAnnounceForL1({ product }: { product: ProductsMinType[0] }) {
	const [modalState, setModalState] = useState({
		confirm: false,
		boost: false,
		pause: false,
		popUp: false,
	});
	const mutationStatus = useUpdateMutationproductStatus();
	const [info, setInfo] = useState<string>('fonction non implémentée');
	const [fn, setFn] = useState<ActionType>('ras');
	const [p, setP] = useState<ProductsMinType[0]>();

	const toggleModal = (modalType: keyof typeof modalState, isOpen: boolean) => {
		setModalState({ ...modalState, [modalType]: isOpen });
		document.body.style.overflow = isOpen ? 'hidden' : 'auto';
	};

	const handleAction = (actionType: StatusType, comment: string) => {
		mutationStatus.mutate({
			product_id: product.product_id,
			status: actionType,
			comment: comment,
		});
		toggleModal('confirm', false);
	};

	const openPopUp = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		toggleModal('popUp', true);
		setP(product);
	};

	const action = (Vact: ActionType) => {
		switch (Vact) {
			case 'boost':
				return handleAction('AWAIT', 'boost');
			case 'repost':
				return handleAction('AWAIT', 'repost');
			case 'pause':
				return handleAction('PAUSE', 'pause');
			case 'delete':
				return handleAction('DELETED', 'delete');
			default:
				return alert('Action non implémentée');
		}
	};
	const openModal = (e: any, typeModal: keyof typeof modalState) => {
		e.preventDefault();
		e.stopPropagation();
		toggleModal(typeModal, true);
	};
	return (
		<>
			<div className={clsx(`w-full px-2 py-1`)}>
				<div className="flex justify-center gap-x-6 rounded-md bg-slate-500 font-sans text-white">
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
				{product.status === 'PAUSE' && (
					<div className={twMerge([className.containStyle, ''])}>
						<div className="flex flex-col justify-between gap-3">
							<div className="flex items-start justify-between">
								<h2 title={product.title} className="mr-5 line-clamp-2 font-bold text-stone-950">
									{product.title}
								</h2>
								<p className="font-roboto text-sm font-bold text-stone-800">{formatPrice(product.price)}</p>
							</div>
							<FeatureComponent productId={product.product_id} nbrFeature={3} />
						</div>
						<div className={clsx('flex w-full flex-row flex-wrap items-center justify-between')}>
							<button
								className={twMerge([
									className.actionButton,
									'border-slate-40 hover:bg-slate-200 text-black ',
								])}
								onClick={(e: any) => {
									openModal(e, 'confirm');
									setInfo('Voulez vous republier cette annonce');
									setFn('repost');
								}}
							>
								<PlayCircle size={size_icon} />
								<span className={className.text}>Republiez</span>
							</button>
							<button
								className={twMerge([className.actionButton, 'border-blue-400 hover:bg-slate-500 '])}
								onClick={(e) => openPopUp(e)}
							>
								<SquarePen size={size_icon} />
								<span className={className.text}>Modifier</span>
							</button>
							<button
								title="Supprimer votre annonce"
								onClick={(e) => {
									openModal(e, 'confirm');
									setInfo('Voulez vous supprimer cette annonce');
									setFn('delete');
								}}
								className={twMerge([className.actionButton, 'bg-red-400 hover:bg-red-600'])}
							>
								<BadgeX size={size_icon} />
								<span className={className.text}>Supprimer</span>
							</button>
						</div>

						<span className="font-roboto text-xs text-gray-600">
							{formatDate(product.product_created_at)}
						</span>
					</div>
				)}
				{product.status === 'AWAIT' && (
					<div className={twMerge([className.containStyle, ''])}>
						<div className="flex w-full flex-col justify-between gap-3">
							<h2 title={product.title} className="mr-5 line-clamp-2 font-bold text-stone-950">
								{product.title}
							</h2>
							<p className="font-roboto text-sm font-bold text-stone-800">{formatPrice(product.price)}</p>
							<FeatureComponent productId={product.product_id} nbrFeature={3} />
						</div>
						<span
							className={clsx(
								'my-3 inline-block rounded-lg border-[1px]  bg-black px-2 py-1 text-center text-[.75rem] font-semibold text-yellow-400'
							)}
						>
							Votre produit est en attente de validation. Il sera publié après vérification.
						</span>
						<span className="text-xs text-gray-500">{formatDate(product.product_created_at)}</span>
					</div>
				)}
				{product.status === 'VALID' && (
					<div className={twMerge([className.containStyle, ''])}>
						<div className="flex flex-col justify-between gap-3">
							<div className="flex flex-col items-start justify-between">
								<h2 title={product.title} className="mr-5 line-clamp-2 font-bold text-stone-950">
									{product.title}
								</h2>
								<p className="font-roboto text-sm font-bold text-stone-800">{formatPrice(product.price)}</p>
							</div>
							<FeatureComponent productId={product.product_id} nbrFeature={3} />
						</div>
						<div className={clsx('flex w-full flex-row flex-wrap items-center justify-between gap-2')}>
							<button
								title="Booster votre annonce"
								className={twMerge([
									className.actionButton,
									'border-slate-40 bg-yellow-400 hover:bg-yellow-300',
								])}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									toggleModal('boost', true);
								}}
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
									'border-slate-40 hover:bg-slate-200 text-black ',
								])}
								onClick={(e: any) => {
									openModal(e, 'confirm');
									setInfo("Voulez vous mettre en pause l'annonce");
									setFn('pause');
								}}
							>
								<Pause size={size_icon} />
								<span className={className.text}>Pause</span>
							</button>
							<button
								title="Supprimer votre annonce"
								onClick={(e) => {
									openModal(e, 'confirm');
									setInfo('Voulez vous supprimer cette annonce');
									setFn('delete');
								}}
								className={twMerge([className.actionButton, 'bg-red-400 hover:bg-red-600'])}
							>
								<BadgeX size={size_icon} />
								<span className={className.text}>Supprimer</span>
							</button>
						</div>
						<span className="font-roboto text-xs text-gray-600">
							{formatDate(product.product_created_at)}
						</span>
					</div>
				)}
				{(product.status === 'DELETED' || product.status === 'REJECTED') && (
					<div className={twMerge([className.containStyle, ''])}>
						<div className="flex items-start justify-between">
							<h2 title={product.title} className="mr-5 line-clamp-2 font-bold text-stone-950">
								{product.title}
							</h2>
							<p className="font-roboto text-sm font-bold text-stone-800">{formatPrice(product.price)}</p>
						</div>
						<FeatureComponent productId={product.product_id} nbrFeature={4} />
						<span className="font-roboto text-xs text-gray-600">
							{formatDate(product.product_created_at)}
						</span>
						<div className="flex w-full flex-col items-baseline justify-start gap-x-1">
							<span
								className={clsx(
									'my-3 inline-block rounded-lg border-[1px] bg-black px-2 py-1 text-center text-[.75rem] font-semibold text-red-500 '
								)}
							>
								{product.status === 'DELETED' && 'Votre produit a été supprimée'}
								{product.status === 'REJECTED' && 'Votre produit a été rejetée'}
							</span>
							{product.status === 'REJECTED' && (
								<div className={clsx('flex w-full flex-row flex-wrap items-center justify-between')}>
									<button
										className={twMerge([
											className.actionButton,
											'border-slate-40 hover:bg-slate-200 text-black',
										])}
										onClick={(e) => {
											openModal(e, 'confirm');
											setInfo('Voulez vous republier cette annonce');
											setFn('repost');
										}}
									>
										<PlayCircle size={size_icon} />
										<span className={className.text}>Republiez </span>
									</button>
									<button
										className={twMerge([className.actionButton, 'border-blue-400 hover:bg-slate-500 '])}
										onClick={(e) => openPopUp(e)}
									>
										<SquarePen size={size_icon} />
										<span className={className.text}>Modifier</span>
									</button>
									<button
										title="Supprimer votre annonce"
										onClick={(e) => {
											openModal(e, 'confirm');
											setInfo('Voulez vous supprimer cette annonce');
											setFn('delete');
										}}
										className={twMerge([className.actionButton, 'bg-red-400 hover:bg-red-600'])}
									>
										<BadgeX size={size_icon} />
										<span className={className.text}>Supprimer</span>
									</button>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
			<ModalEditProduct
				product={p}
				closePopUp={() => toggleModal('popUp', false)}
				showPopUp={modalState.popUp}
			/>
			<ModalConfirmation
				closePopUp={() => toggleModal('confirm', false)}
				showPopUp={modalState.confirm}
				message={info}
				confirm={() => action(fn)}
			/>
			<ModalBoostAnnouce
				closePopUp={() => toggleModal('boost', false)}
				showPopUp={modalState.boost}
				product={product}
			/>
		</>
	);
}
