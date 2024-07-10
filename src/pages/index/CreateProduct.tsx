/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import InputCategorie from '@/components/ui/InputCategorie';
import InputFileComponent from '@/components/ui/InputFileComponent';
import {
	CatCreateType,
	field_annonce,
	handleConnect,
	onCreateProduct,
	ToastSuccess,
} from '@/lib/utils';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';

// import { getAllChildCategoriesOptions, useCreateProductMutation } from '@/utils/queryOptions';
import SuggestCat from '@/components/product/suggestCat';
import PopUpComponent from '@/components/ui/PopUpComponent';
import SelectCategorie from '@/components/ui/SelectCategorie';
import TipsComponent from '@/components/ui/TipsComponent';
import { useResetScrollBar } from '@/hooks/useresetScroll';
import { announceRoot } from '@/lib/route';
import { f_form_type } from '@/services/api/product_categorie';
import { useDataInputState } from '@/services/state/App/dataInputState';
import { useAuth } from '@/services/state/User/auth';
import { filterCategory } from '@/utils/helpers';
import {
	get_all_parents,
	get_children,
	get_old_parent,
	getCategorieById,
} from '@/utils/mock/Menucaegorie';
import {
	getAllChildCategoriesOptions,
	getAllfeaturesOptions,
	useCreateProductMutation,
} from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { ArrowLeftCircle, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';

const tipsForClient = [
	'ForClient',
	'Ne partagez jamais vos informations personnelles sensibles (comme votre numéro de carte bancaire) avec des inconnus.',
	'Rencontrez toujours les acheteurs/vendeurs dans des lieux publics et bien éclairés.',
	'Vérifiez toujours les informations du vendeur/acheteur avant de conclure une transaction.',
	'Méfiez-vous des offres qui semblent trop belles pour être vraies.',
	'Utilisez les plateformes de paiement sécurisées recommandées par le site.',
	'Signalez toute activité suspecte ou annonce frauduleuse aux administrateurs du site.',
	'Gardez une trace de toutes les communications et transactions.',
	'Ne cliquez pas sur les liens suspects ou non vérifiés dans les emails ou messages.',
];

const tipsTitle = [
	field_annonce[0],
	'Soyez clair et précis sur ce que vous vendez.',
	'Évitez les termes généraux et soyez spécifique.',
	'Indiquez la marque ou le modèle si cela est pertinent.',
	'Utilisez des mots-clés pertinents que les acheteurs pourraient rechercher.',
];
const tipsPrice = [
	field_annonce[1],
	'Recherchez des prix similaires pour rester compétitif.',
	'Évitez les prix trop élevés ou trop bas.',
];
const tipsDescription = [
	field_annonce[2],
	"Soyez précis sur l'article ou le service.",
	'Mentionnez les caractéristiques principales.',
	'Indiquez les avantages.',
	'Soyez honnête sur les défauts.',
	'Utilisez des phrases courtes.',
	'Ajoutez des infos sur la livraison et le paiement.',
	'Utilisez des listes à puces.',
	'Relisez pour corriger les fautes.',
];

export default function CreateProduct() {
	const { data: categories } = useSuspenseQuery(getAllChildCategoriesOptions());
	const { data: features } = useSuspenseQuery(getAllfeaturesOptions());
	const { isAuth, InfoUser } = useAuth((state) => state);
	const {
	
		fieldCharac,
		setFieldCharac,
	
	} = useDataInputState((state) => state);
	const dataProduct = useInputCategorie((state) => state.dataProduct);
	const dataFeatureProduct = useInputCategorie((state) => state.dataProductFeature);
	const resetFile = useInputCategorie((state) => state.resetFile);

	const resetAll = useInputCategorie((state) => state.resetAll);
	const [showModal, setShowModal] = useState(false);
	const [stepC, setStepC] = useState<string[]>([]);
	const [stepSuggest, setStepSuggest] = useState<string[]>([]);
	const [fieldSelect, setFieldSelect] = useState<string>('');
	const [category, setCategory] = useState<CatCreateType>();
	const [result_cat, setResult_cat] = useState<CatCreateType[]>([]);
	const [result_cat_filt, setResult_cat_filt] = useState<CatCreateType[]>([]);
	const [parent_cat, setParent_cat] = useState<CatCreateType>();
	const filesData = useInputCategorie((state) => state.filesData);
	const errorInput = useInputCategorie((state) => state.errorInput);
	const navigate = useNavigate();
	useResetScrollBar();
	const {
		mutate: createProduct,
		isSuccess: isSuccessCreateProduct,
		isPending: isPendingCreateProduct,
	} = useCreateProductMutation();	

	// useEffect(() => {
	// 	const title = dataProduct[field_annonce[0]]!;
	// 	const price = dataProduct[field_annonce[1]]!;
	// 	const description = dataProduct[field_annonce[2]]!;
	// 	setMainInput({ title: title, price: price, description: description });
	// }, [dataProduct[field_annonce[0]], dataProduct[field_annonce[1]], dataProduct[field_annonce[2]]]);
	// useEffect(() => {
	// 	setDataProduct({
	// 		[field_annonce[0]]: mainInput.title,
	// 		[field_annonce[1]]: mainInput.price,
	// 		[field_annonce[2]]: mainInput.description,
	// 	});
	// }, []);

	useEffect(() => {
		handleHierachie(null);
		resetFile();
		setParent_cat({
			icon: null,
			label: '',
			id: '',
			parent_category_id: null,
			is_parentable: 0,
		});
	}, []);

	useDebounce(
		() => {
			const title = (dataProduct[field_annonce[0]] as string)?.trim();
			if (!title) {
				return setStepSuggest([]);
			}
			const filtered = filterCategory(title, categories, features);
			const recup = filtered
				.flatMap((item) => {
					if (item.is_parentable === 0) {
						return get_old_parent(item.id, categories)!;
					}
					return item;
				})
				.slice(0, 5);
			const newSuggestions = recup.map((item) => {
				const pathIds = get_all_parents(item.id, categories);
				return pathIds.join(',');
			});
			setStepSuggest((prev) => {
				const combined = [...prev, ...newSuggestions];
				const uniqueSet = new Set(combined);
				const uniqueArray = Array.from(uniqueSet);
				return uniqueArray.slice(-4);
			});
		},
		405,
		[dataProduct[field_annonce[0]]]
	);

	const handleHierachie = (categoryId: string | null) => {
		setResult_cat_filt([]);
		const result_cat = get_children(categoryId || null, categories);
		setResult_cat(result_cat);
		const parent_cat = getCategorieById(categoryId || null, categories);
		setParent_cat(parent_cat);
		setCategory(undefined);
		setStepC((prev) => {
			let newState = [...prev];
			const parentId = parent_cat?.id || '';
			newState = parentId ? newState : [];
			if (!parentId) return newState;
			if (newState.includes(parentId)) {
				const index = newState.indexOf(parentId);
				return newState.slice(0, index + 1);
			} else {
				return [...newState, parentId];
			}
		});
	};

	// const getChildCategorie = (categorieId: string | null) => {
	// 	const allChild = get_children(categorieId, data);
	// 	if (allChild?.length == 0) {
	// 		const characteristics = get_caracteristique_child(categorieId, data);
	// 		const mergedArray = characteristics.reduce((acc, curr) => acc.concat(curr), []);
	// 		setFieldCharac(mergedArray);
	// 		return;
	// 	}
	// 	return allChild;
	// };

	// const back = () => {
	// 	const last = getChildCategorie(lastChild?.parent_category_id || null);
	// 	setChildsCategorie(last);
	// 	setProductSelect(undefined);
	// 	setFieldCharac([]);
	// 	const parent = get_parent(lastChild?.parent_category_id || null, data);
	// 	setLastChild(parent);
	// 	removeLabel();
	// };

	// const forwad = (id: string) => {
	// 	const cat = getCategorieById(id, data);
	// 	setProductSelect(undefined);
	// 	resetAll();
	// 	if (!cat) return;
	// 	if (cat.is_parentable === 1) {
	// 		setProductSelect(cat);
	// 		setStep('one');
	// 	}
	// 	setLabelList(cat);

	// 	const parent = get_parent(id, data);
	// 	const childs = getChildCategorie(id);
	// 	if (!childs) return;
	// 	setLastChild(parent);
	// 	setChildsCategorie(childs);
	// };
	const collectFeatures = (Ids: string[]) => {
		setFieldCharac([]);
		setFieldSelect('');
		const newFeatures: f_form_type[] = [];
		Ids.forEach((id) => {
			const feature = features.filter((feature) => feature.category_id === id);
			newFeatures.push(...feature);
		});
		setFieldCharac(newFeatures);
		setFieldSelect(Ids.join(','));
		setShowModal(false);
		resetAll();
	};

	if (isSuccessCreateProduct) {
		ToastSuccess('Annonce crée avec succès');
		navigate({
			to: announceRoot.to,
			search: {
				provider_id: InfoUser.id,
				filter: { order_by: 'date_desc', status: ['AWAIT', 'VALID'] },
			},
		});
	}
	// if (mutation.isError) {
	// 	ToastError('Une erreur est survenue lors de la création du produit');
	// }

	return (
		<>
			<div className="mt-2 flex w-app flex-row items-start justify-start gap-5 self-center bg-slate-200">
				<div className="mb-10 flex w-2/3 flex-col items-center justify-center px-14">
					<h1 className="text-xl font-bold">Creer une nouvelle annonce</h1>
					<InputCategorie
						valueSave={dataProduct[field_annonce[0]]}
						item={{
							name: field_annonce[0],
							placeholder: 'Iphone 13 Pro Max',
							collect_type: 'text',
							required: 1,
							min: 3,
							max: 60,
							match: /^[a-zA-Z0-9À-ÖØ-öø-ÿ\s()x.-\\&,/]+$/g,
							id: '',
						}}
					/>
					<InputCategorie
						valueSave={dataProduct[field_annonce[1]]}
						item={{
							name: field_annonce[1],
							collect_type: 'number',
							placeholder: '150000',
							required: 1,
							min: 5,
							max: 99999999999,
							id: '',
						}}
					/>
					<InputCategorie
						valueSave={dataProduct[field_annonce[2]]}
						item={{
							name: field_annonce[2],
							collect_type: 'textarea',
							placeholder: "Description de l'annonce",
							required: 1,
							min: 3,
							max: 850,
							match:  /^[a-zàâçéèêëîïôûùüÿñæœ(),;:"'&~$%@0-9\\// .-]*$/gi,
							id: '',
						}}
					/>
					<InputFileComponent name={"photo de l'annonce"} max={5} />
					<div className="my-1 flex w-full flex-col flex-wrap items-center justify-start rounded-md bg-white p-4">
						{!fieldSelect ? (
							<>
								<button
									onClick={() => setShowModal(true)}
									className="rounded-lg bg-primary px-2 py-1 font-BlackOpsOne text-xs/4  text-white"
								>
									Choisir la categorie
								</button>
								<span className="my-2 font-BlackOpsOne  text-lg/4">ou</span>
								<span className="mb-2 font-roboto text-xs/4 underline">choisir une catégorie suggère:</span>
								<div className="flex w-full flex-row flex-wrap items-start justify-center gap-1">
									{stepSuggest.map((item, i) => {
										return (
											<SuggestCat
												categories={categories}
												stepC={item.split(',')}
												fieldSelect={fieldSelect}
												collectFeatures={collectFeatures}
												key={i}
											/>
										);
									})}
								</div>
							</>
						) : (
							<div className=" flex w-full flex-col items-center justify-center gap-1">
								<span className="font-BlackOpsOne text-sm">Catégorie sélectionnée :</span>
								<div className="mb-4 flex items-center justify-center gap-1">
									{fieldSelect.split(',').map((catId, index) => {
										return (
											<div key={index} className="inline-flex items-center justify-center gap-1">
												<span
													className={clsx('font-roboto text-[.805rem] font-bold capitalize  text-blue-500 ')}
												>
													{getCategorieById(catId, categories)?.label}
												</span>
												<div
													className={clsx('size-1 rounded-full bg-blue-500', {
														'opacity-0': index === fieldSelect.split(',').length - 1,
														'opacity-100': index !== fieldSelect.split(',').length - 1,
													})}
												/>
											</div>
										);
									})}
								</div>
								<button
									className="rounded-lg bg-primary px-2 py-1 font-roboto text-xs/4 text-white  hover:bg-primary/90"
									onClick={() => setFieldSelect('')}
								>
									Changer de catégorie
								</button>
							</div>
						)}
					</div>
					{(fieldSelect ? fieldCharac : []).map((item, i) => {
						if (item.collect_type === 'text' || item.collect_type === 'number') {
							return (
								<InputCategorie valueSave={dataProduct[item.name]} isfeature={true} item={item} key={i} />
							);
						}
						if (item.collect_type === 'select') {
							return (
								<SelectCategorie
									key={i}
									id={item.id}
									values={item.enum || []}
									isfeature={true}
									label={item.name}
									required={Boolean(item.required)}
									defaultValue={dataProduct[item.name]}
								/>
							);
						}
					})}

					{fieldCharac.length !== 0 && fieldSelect && (
						<>
							<div className="my-4 flex w-full flex-row items-center justify-center gap-x-2">
								{!isAuth ? (
									<button
										onClick={handleConnect}
										className="flex items-center gap-x-2 rounded-lg border bg-gray-200 px-3 py-2 shadow-lg"
									>
										<span className={''}>connecter vous pour continuer</span>
										<img
											src={'/img/google.png'}
											alt=""
											className={`size-5 bg-cover bg-center bg-no-repeat text-white`}
										/>
									</button>
								) : (
									<button
										disabled={isPendingCreateProduct}
										className={clsx('my-4 rounded-lg bg-primary px-3 py-1 text-sm  text-white')}
										type="submit"
										onClick={() =>
											onCreateProduct({
												createProduct,
												dataFeatureProduct,
												dataProduct,
												fieldSelect,
												errorInput,
												filesData
											})
										}
									>
										{isPendingCreateProduct ? 'Creation en cours...' : 'Publier une annonce'}
									</button>
								)}
							</div>
						</>
					)}
				</div>
				<div className={'flex w-1/3 flex-col items-center justify-center'}>
					<TipsComponent tips={tipsTitle} />
					<TipsComponent tips={tipsDescription} />
					<TipsComponent tips={tipsPrice} />
				</div>
			</div>
			<PopUpComponent
				isOpen={showModal}
				setHide={setShowModal}
				styleContainer="flex justify-center flex-col bg-gray-300 rounded-lg p-2 mt-[10%]"
				animationName="zoom"
			>
				<div className="flex w-full flex-col items-center justify-center">
					{/* <h1 className="py-2">Definir la categorie</h1> */}
					<div className="flex items-center justify-center gap-1 ">
						{stepC.length >= 1 && (
							<>
								<Home
									onClick={() => handleHierachie(null)}
									className="cursor-pointer hover:text-blue-700"
									strokeWidth={2}
									size={15}
								/>
								<div className="size-1 cursor-pointer rounded-full bg-black" />
							</>
						)}
						{stepC.map((catId, index) => {
							return (
								<div key={index} className="inline-flex items-center justify-center gap-1">
									<button
										disabled={index === stepC.length - 1}
										onClick={() => {
											handleHierachie(catId);
										}}
										key={index}
										className={clsx('font-BlackOpsOne text-[.905rem]  capitalize hover:text-blue-500', {
											'hover:underline': index !== stepC.length - 1,
										})}
									>
										{getCategorieById(catId, categories)?.label}
									</button>
									<div
										className={clsx('size-1 rounded-full bg-black', {
											'opacity-0': index === stepC.length - 1,
											'opacity-100': index !== stepC.length - 1,
										})}
									/>
								</div>
							);
						})}
					</div>
					<span className="text-[.83rem] font-bold text-indigo-800 shadow-2xl">{category?.label}</span>
					<div className="flex max-h-[200px] w-[500px] flex-wrap items-center justify-center gap-1 overflow-auto">
						<ArrowLeftCircle
							onClick={() => {
								handleHierachie(parent_cat?.parent_category_id || null);
							}}
							size={22}
							className={'cursor-pointer rounded-full text-primary'}
						/>
						{result_cat?.map((cat) => {
							return (
								<div key={cat.id} className="flex flex-col items-center justify-center ">
									<div className={clsx('transition-all duration-100')}>
										<button
											className={clsx(
												' m-1 flex items-center justify-center gap-2 rounded-3xl border bg-white p-1 font-bold',
												{
													' border-primary': !!cat.is_parentable,
													' border-slate-400': !cat.is_parentable,
												}
											)}
											onClick={() => {
												handleHierachie(cat?.id);
											}}
										>
											<img src={cat.icon || ''} className="size-4" alt="" />
											<span className={clsx('text-xs')}>{cat.label}</span>
										</button>
									</div>
								</div>
							);
						})}
						<button
							onClick={() => {
								collectFeatures(stepC);
							}}
							className={clsx('my-4  rounded-sm bg-primary px-4 py-1 text-white', {
								hidden: result_cat.length > 0,
								visible: result_cat.length === 0,
							})}
						>
							Validez
						</button>
					</div>
				</div>
			</PopUpComponent>
		</>
	);
}

/// Galate 5 v13; Tite 2 v11-14 ;Genese 34 Sichem et Dina; exode 22 ; 2samuel 13; Genese 2 v22
