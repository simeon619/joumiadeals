/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DateInputCategori from '@/components/ui/DateInputCategori';
import InputCategorie from '@/components/ui/InputCategorie';
import InputComponent from '@/components/ui/InputComponent';
import InputFileComponent from '@/components/ui/InputFileComponent';
import SelectCategorie from '@/components/ui/SelectCategorie';
import SwitchInputCategori from '@/components/ui/SwitchInputCategori';
import { ToastError, ToastSuccess, ToastWarn, handleConnect } from '@/lib/utils';
import { AlarmCheck } from 'lucide-react';
import { CategoryType, FieldOptionsType } from '@/services/api/product_categorie';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { z } from 'zod';

import {
	getCategorieById,
	get_all_parents,
	get_caracteristique_child,
	get_children,
	get_first_cat_icon,
	get_old_parent,
	get_parent,
} from '@/utils/mock/Menucaegorie';
// import { getAllChildCategoriesOptions, useCreateProductMutation } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Undo } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import TextAreaComponent from '@/components/ui/TextAreaComponent';
import { getAllChildCategoriesOptions, useCreateProductMutation } from '@/utils/queryOptions';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from '@tanstack/react-router';
import { announceRoot } from '@/lib/route';
import { useAuth } from '@/services/state/User/auth';
import { useResetScrollBar } from '@/hooks/useresetScroll';
import { useDebounce } from 'react-use';
import { filterCategory } from '@/utils/helpers';
import { adviceTitleAnnouce } from '@/utils/constante';
import { useDataInputState } from '@/services/state/App/dataInputState';
export const ProductSchema = z.object({
	title: z
		.string()
		.min(3, { message: 'titre doit contenir au moins 3 caractere' })
		.max(40, { message: 'titre trop long' }),
	description: z
		.string()
		.min(10, { message: 'description doit contenir au moins 10 caractere' })
		.max(1300, { message: 'description trop longue' }),
	price: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0, {
		message: "le prix n'est pas valide",
	}),
});
export type ProductSchemaType = z.infer<typeof ProductSchema>;
export default function CreateProduct() {
	const { data } = useSuspenseQuery(getAllChildCategoriesOptions());
	const account = useAuth((state) => state.InfoUser);
	const {
		childsCategorie,
		setChildsCategorie,
		labelList,
		setLabelList,
		fieldCharac,
		setFieldCharac,
		productSelect,
		setProductSelect,
		labelSuggest,
		setLabelSuggest,
		suggestCategory,
		step,
		setStep,
		lastChild,
		setLastChild,
		removeLabel,
		setSuggestCategory,
		mainInput,
		setMainInput,
	} = useDataInputState((state) => state);
	const valueInput = useInputCategorie((state) => state.valueInput);
	const resetAll = useInputCategorie((state) => state.resetAll);
	const filesData = useInputCategorie((state) => state.filesData);
	const errorInput = useInputCategorie((state) => state.errorInput);
	const navigate = useNavigate();
	const isAuth = useAuth((state) => state.isAuth);
	useResetScrollBar();
	const mutation = useCreateProductMutation();
	useEffect(() => {
		const childs = getChildCategorie(null);
		if (!childs) return;
		setChildsCategorie(childs);
	}, []);
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<ProductSchemaType>({
		resolver: zodResolver(ProductSchema),
	});
	useEffect(() => {
		const title = watch('title');
		const price = watch('price');
		const description = watch('description');
		setMainInput({ title: title, price: price, description: description });
	}, [watch('title'), watch('price'), watch('description')]);

	useEffect(() => {
		setValue('title', mainInput.title);
		setValue('price', mainInput.price);
		setValue('description', mainInput.description);
	}, []);
	useDebounce(
		() => {
			const title = watch('title')?.trim();
			if (!title) {
				return setSuggestCategory([]);
			}
			const filtered = filterCategory(title, data);
			const recup = filtered
				.flatMap((item) => {
					if (item.is_parentable === 0) {
						return get_old_parent(item.id, data)!;
					}
					return item;
				})
				.slice(0, 7);
			const dataSuggest = recup.map((item) => {
				const dataSA = get_all_parents(item?.id, data);
				const icon = get_first_cat_icon(item?.id, data)!;
				return { suggest: dataSA.reverse().join(' > '), id: item.id, icon };
			});
			if (dataSuggest.length !== 0) {
				setSuggestCategory([]);
				setSuggestCategory(dataSuggest);
			}
		},
		405,
		[watch('title')]
	);

	const getChildCategorie = (categorieId: string | null) => {
		const allChild = get_children(categorieId, data);
		if (allChild?.length == 0) {
			const characteristics = get_caracteristique_child(categorieId, data);
			const mergedArray = characteristics.reduce((acc, curr) => acc.concat(curr), []);
			setFieldCharac(mergedArray);
			return;
		}
		return allChild;
	};

	const back = () => {
		const last = getChildCategorie(lastChild?.parent_category_id || null);
		setChildsCategorie(last);
		setProductSelect(undefined);
		setFieldCharac([]);
		const parent = get_parent(lastChild?.parent_category_id || null, data);
		setLastChild(parent);
		removeLabel();
	};

	const forwad = (id: string) => {
		const cat = getCategorieById(id, data);
		setProductSelect(undefined);
		resetAll();
		if (!cat) return;
		if (cat.is_parentable === 1) {
			setProductSelect(cat);
			setStep('one');
		}
		setLabelList(cat);

		const parent = get_parent(id, data);
		const childs = getChildCategorie(id);
		if (!childs) return;
		setLastChild(parent);
		setChildsCategorie(childs);
	};

	const onSubmit = (data: ProductSchemaType): void => {
		if (filesData.length == 0) {
			return ToastWarn('Vous devez ajouter au moins une image.');
		}
		for (const [key, value] of Object.entries(valueInput)) {
			if (!value && value !== 0) {
				return ToastWarn('Le champ ' + key + ' est obligatoire');
			}
		}
		for (const [key, value] of Object.entries(errorInput)) {
			if (value) {
				return ToastWarn('Le champ ' + key + ' est mal défini');
			}
		}
		mutation.mutateAsync({
			dataProduct: {
				...data,
				category_id: productSelect?.id,
				caracteristique: JSON.stringify(valueInput),
			},
			photos: filesData,
		});
	};

	if (mutation.isSuccess) {
		ToastSuccess('Annonce crée avec succès');
		navigate({
			to: announceRoot.to,
			search: { provider_id: account.id, filter: { order_by: 'date_desc' } },
		});
	}
	// if (mutation.isError) {
	// 	ToastError('Une erreur est survenue lors de la création du produit');
	// }

	return (
		<div className="mt-2 flex w-app self-center">
			<div className="grid grid-cols-6 gap-x-5 border-slate-800">
				<div
					className={twMerge(
						' mx-3 h-[600px] min-w-[300px] overflow-y-auto invisible border-slate-800',
						step === 'two' && 'visible col-start-1 col-end-3'
					)}
				>
					<div className="sticky top-0 flex items-center justify-center gap-4 rounded-md border-b-[1px] border-slate-800 bg-slate-100 py-2 text-slate-600">
						<Undo
							className="cursor-pointer rounded-full bg-primary  p-[1px] text-teal-50"
							onClick={() => back()}
							size={30}
						/>
						<h1 className="text-xl">Choisir la Catégories</h1>
					</div>
					<div className="flex flex-col justify-center">
						{childsCategorie?.map((cat) => {
							return (
								<div key={cat.id}>
									<button
										onClick={() => {
											forwad(cat.id);
										}}
										className={twMerge(
											'w-full rounded-md border-b-[1px] grid grid-cols-12 place-items-start gap-x-1 pl-5 border-slate-800 py-1 text-slate-600 duration-200 hover:scale-95 hover:bg-slate-800/10',
											cat.is_parentable === 0 && 'font-bold',
											productSelect?.label === cat.label && 'scale-95 bg-slate-600/30'
										)}
									>
										{cat.icon && <img src={cat.icon} alt="logo" className="col-start-1 col-end-2 size-7" />}
										<span className="col-start-2 col-end-13">{cat.label}</span>
									</button>
								</div>
							);
						})}
					</div>
				</div>
				<div
					className={twMerge(
						'col-start-2 col-end-6 mx-20 border-slate-800',
						step === 'two' && 'col-start-3 col-end-7'
					)}
				>
					<div className="my-5 flex gap-x-2">
						{labelSuggest ? (
							<span>
								{labelSuggest.split(' > ').map((l, i, arr) => {
									return (
										<span
											className={`${i == arr.length - 1 ? 'text-base font-semibold underline' : "text-sm after:mx-1 after:content-['>']"}`}
											key={i}
										>
											{l}
										</span>
									);
								})}
							</span>
						) : (
							<>
								{Object.values(labelList).map((cat) => {
									return (
										<div key={cat.id}>
											<span className="text-sm">{cat.label} &gt;</span>
										</div>
									);
								})}
								<span className="text-base font-semibold underline">{productSelect?.label}</span>
							</>
						)}
					</div>
					{/* {fieldCharac.length == 0 && <p className="text-center">Aucune caractéristique</p>} */}
					<form className="mb-10 flex flex-col justify-center">
						{/* <div className={'my-3 flex items-center rounded-lg border  p-2 shadow-sm'}>
							<AlarmCheck />
							<div>
								<h1>Info</h1>
								<ul className="text-xs">
									<li>one</li>
									<li>two</li>
									<li>three</li>
								</ul>
							</div>
						</div> */}
						<div className="flex flex-col">
							<InputComponent
								label="Titre de l'annonce"
								type="text"
								name="title"
								placeholder="titre de l'annonce"
								register={register}
								errors={errors}
								autoComplete="off"
								advices={adviceTitleAnnouce}
							/>
							<div className={twMerge('flex flex-col ', suggestCategory.length > 0 && 'bg-gray-100 p-2')}>
								{suggestCategory?.length > 0 && (
									<span className="mb-2 font-semibold text-gray-700 underline">
										Choisissez une categorie suggere:
									</span>
								)}
								<div className=" flex flex-col  gap-y-3">
									{suggestCategory?.map((c, i) => {
										return (
											<button
												type="button"
												onClick={(e) => {
													forwad(c.id);
													setLabelSuggest(c.suggest);

													setSuggestCategory([]);
													e.preventDefault();
												}}
												className="ml-[5%] flex items-start gap-x-2 text-sm text-gray-700 hover:text-primary"
												key={i}
											>
												{c?.icon && <img src={c?.icon} alt="logo" className="size-5" />}
												<span>{c.suggest}</span>
											</button>
										);
									})}
								</div>
								<button
									onClick={() => {
										setStep('two');
										setLabelSuggest('');
										setSuggestCategory([]);
									}}
									type="button"
									className={twMerge(
										'flex items-center text-center text-sm mb-3  text-primary bg-gray-100 p-2',
										suggestCategory.length > 0 && 'my-1'
									)}
								>
									Ou cliquez ici pour choisir votre categorie.
								</button>
							</div>
						</div>

						<InputComponent
							label="prix de l'annonce"
							name="price"
							type="number"
							placeholder="Prix de l'annonce (FCFA)"
							register={register}
							errors={errors}
						/>
						<TextAreaComponent
							label="Description"
							name="description"
							placeholder="Description de l'annonce"
							register={register}
							errors={errors}
							advices={adviceTitleAnnouce}
						/>
						<InputFileComponent name={"photo de l'annonce"} max={5} />
						{fieldCharac.map((item, i) => {
							if (item.field === 'text' || item.field === 'number') {
								return <InputCategorie valueSave={valueInput[item.name]} item={item} key={i} />;
							}
							if (item.field === 'select') {
								return (
									<SelectCategorie
										key={i}
										values={item.enum || []}
										label={item.name}
										require={item.require}
										defaultValue={valueInput[item.name]}
									/>
								);
							}
							// if (item.field === 'file') {
							// 	return <InputFileComponent name={item.name} max={item.max} key={i} />;
							// }
							// if (item.field === 'date') {
							// 	return <DateInputCategori item={item} key={i} />;
							// }
							// if (item.field === 'checkbox') {
							// 	return <SwitchInputCategori item={item} key={i} />;
							// }
						})}
						{fieldCharac.length !== 0 && (
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
											disabled={mutation.isPending}
											className={twMerge('w-1/2 rounded-sm bg-primary p-2 text-white my-4')}
											type="submit"
											onClick={handleSubmit(onSubmit)}
										>
											{mutation.isPending ? 'Creation en cours...' : "creer l'annonce"}
										</button>
									)}
								</div>
							</>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}
