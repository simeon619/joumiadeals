/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import DateInputCategori from '@/components/ui/DateInputCategori';
import InputCategorie from '@/components/ui/InputCategorie';
import InputComponent from '@/components/ui/InputComponent';
import InputFileComponent from '@/components/ui/InputFileComponent';
import SelectCategorie from '@/components/ui/SelectCategorie';
import SwitchInputCategori from '@/components/ui/SwitchInputCategori';
import { ToastError, ToastSuccess, ToastWarn } from '@/lib/utils';
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
export const ProductSchema = z.object({
	title: z
		.string()
		.min(3, { message: 'titre doit contenir au moins 3 caractere' })
		.max(40, { message: 'titre trop long' }),
	description: z
		.string()
		.min(3, { message: 'description doit contenir au moins 3 caractere' })
		.max(300, { message: 'description trop longue' }),
	price: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
		message: "le prix n'est pas valide",
	}),
});
export type ProductSchemaType = z.infer<typeof ProductSchema>;
export default function CreateProduct() {
	const { data } = useSuspenseQuery(getAllChildCategoriesOptions());
	const account = useAuth((state) => state.InfoUser);
	const [childsCategorie, setChildsCategorie] = useState<CategoryType>();
	const [labelList, setLabelList] = useState<{ label: string; id: string }[]>([]);
	const [lastChild, setLastChild] = useState<CategoryType[0]>();
	const [fieldCharac, setFieldCharac] = useState<FieldOptionsType>([]);
	const [productSelect, setProductSelect] = useState<CategoryType[0]>();
	const [labelSuggest, setLabelSuggest] = useState<string>('');
	const [suggestCategory, setSuggestCategory] = useState<
		{ id: string; suggest: string; icon: string | null }[]
	>([]);
	const valueInput = useInputCategorie((state) => state.valueInput);
	const [step, setStep] = useState<'one' | 'two' | 'three'>('one');
	const resetAll = useInputCategorie((state) => state.resetAll);
	const filesData = useInputCategorie((state) => state.filesData);
	const errorInput = useInputCategorie((state) => state.errorInput);
	const navigate = useNavigate();
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
		formState: { errors },
	} = useForm<ProductSchemaType>({
		resolver: zodResolver(ProductSchema),
	});
	useDebounce(
		() => {
			const title = watch('title')?.trim();
			if (!title) {
				return setSuggestCategory([]);
			}

			const titleNormalized = title.normalize('NFD').replace(/[\u0300-\u036f\s()\-/,+'']/g, '');
			// const titleRegex = new RegExp( titleNormalized , 'gi');
			// const titleRegex = new RegExp('.*' + titleNormalized.split('').join('*') + '.*', 'gi');
			// const titleRegex = new RegExp('.*' + titleNormalized + '.*', 'gi');
			const titleRegex = new RegExp('.*' + titleNormalized + '.*', 'gi');

			const filtered = data.filter((item) => {
				const labelNormalized = item.label
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f\s()\-/,+'']/gi, '');

				const labelMatch = titleRegex.test(labelNormalized);

				const caracMatch = item.caracteristique_field.some((carac: { [x: string]: any[] }) => {
					if (carac && carac['enum']) {
						return carac['enum'].some((el: string) => {
							const elNormalized = el.normalize('NFD').replace(/[\u0300-\u036f\s()\-/,+'']/gi, '');

							const isMatch = titleRegex.test(elNormalized);
							return isMatch;
						});
					}
					return false;
				});

				return labelMatch || caracMatch;
			});

			const recup = filtered
				.flatMap((item) => {
					if (item.is_parentable === 0) {
						const dataParent = get_old_parent(item.id, data)!;
						return dataParent;
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
		475,
		[watch('title')]
	);

	const getChildCategorie = (categorieId: string | null) => {
		const allChild = get_children(categorieId, data);
		if (allChild?.length == 0) {
			// const cat = getCategorieById(categorieId || '', data);
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
		setLabelList((prev) => {
			return prev.slice(0, -1);
		});
	};

	const forwad = (id: string) => {
		const cat = getCategorieById(id, data);
		setProductSelect(undefined);
		resetAll();
		if (!cat) return;
		if (cat.is_parentable === 1) {
			setProductSelect(cat);
			setStep('one');
			// const dataSA = get_all_parents(cat?.id, data);
			// setLabelSuggest(dataSA.reverse().join(' > '))
		}
		setLabelList((prev) => {
			if (!cat.parent_category_id) {
				return [{ label: cat.label, id: cat.id }];
			}
			const index = prev.findIndex((c) => c.label == cat.label);
			if (index == -1 && cat.is_parentable === 0) {
				return [...prev, { label: cat.label, id: cat.id }];
			}

			return prev;
		});

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
		<div className="mt-8 flex w-app self-center">
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
							<span>{labelSuggest}</span>
						) : (
							<>
								{Object.values(labelList).map((cat) => {
									return (
										<div key={cat.id}>
											<span className="text-sm">{cat.label} &gt;</span>
										</div>
									);
								})}
								<span className="text-base underline">{productSelect?.label}</span>
							</>
						)}
					</div>
					{/* {fieldCharac.length == 0 && <p className="text-center">Aucune caractéristique</p>} */}
					<form className="mb-10 flex flex-col justify-center">
						<div className="flex flex-col">
							<InputComponent
								label="Titre de l'annonce"
								type="text"
								name="title"
								placeholder="titre de l'annonce"
								register={register}
								errors={errors}
							/>
							<div className={twMerge('flex flex-col ', suggestCategory.length > 0 && 'bg-gray-100 p-2')}>
								<button
									onClick={() => {
										setStep('two');
										setLabelSuggest('');
										setSuggestCategory([]);
									}}
									type="button"
									className={twMerge(
										'flex items-center text-center text-sm text-primary bg-gray-100 p-2',
										suggestCategory.length > 0 && 'my-1'
									)}
								>
									Cliquez ici pour choisir votre categorie
								</button>
								{suggestCategory?.length > 0 && (
									<span className="font-semibold text-gray-700 underline">Ou choisissez une categorie suggere:</span>
								)}
								<div className="my-2 flex flex-col items-center gap-y-3">
									{suggestCategory?.map((c, i) => {
										return (
											<button
												type="button"
												onClick={(e) => {
													forwad(c.id);
													setLabelSuggest(() => c.suggest);

													setSuggestCategory(() => []);
													e.preventDefault();
												}}
												className="flex items-start  gap-x-2 text-sm text-gray-700 hover:text-primary"
												key={i}
											>
												{c?.icon && <img src={c?.icon} alt="logo" className=" size-5" />}
												<span>{c.suggest}</span>
											</button>
										);
									})}
								</div>
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
						/>
						<InputFileComponent name={"photo de l'annonce"} max={5} />
						{fieldCharac.map((item, i) => {
							if (item.field === 'text' || item.field === 'number') {
								return <InputCategorie item={item} key={i} />;
							}
							if (item.field === 'select') {
								return (
									<SelectCategorie
										key={i}
										values={item.enum || []}
										label={item.name}
										require={item.require}
									/>
								);
							}
							// if (item.field === 'file') {
							// 	return <InputFileComponent name={item.name} max={item.max} key={i} />;
							// }
							if (item.field === 'date') {
								return <DateInputCategori item={item} key={i} />;
							}
							if (item.field === 'checkbox') {
								return <SwitchInputCategori item={item} key={i} />;
							}
						})}
						{fieldCharac.length !== 0 && (
							<div className="my-4 flex w-full flex-row items-center justify-center gap-x-2">
								<button
									disabled={mutation.isPending}
									className={twMerge('w-1/2 rounded-sm bg-primary p-2 text-white my-4')}
									type="submit"
									onClick={handleSubmit(onSubmit)}
								>
									{mutation.isPending ? 'Creation en cours...' : "creer l'annonce"}
								</button>
							</div>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}
