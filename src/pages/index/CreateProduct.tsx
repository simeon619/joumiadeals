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
	get_caracteristique_child,
	get_children,
	get_parent,
} from '@/utils/mock/Menucaegorie';
// import { getAllChildCategoriesOptions, useCreateProductMutation } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Undo } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import TextAreaComponent from '@/components/ui/TextAreaComponent';
import { getAllChildCategoriesOptions, useCreateProductMutation } from '@/utils/queryOptions';
const ProductSchema = z.object({
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
type ProductSchemaType = z.infer<typeof ProductSchema>;
export default function CreateProduct() {
	const { data } = useSuspenseQuery(getAllChildCategoriesOptions());
	const [childsCategorie, setChildsCategorie] = useState<CategoryType>();
	const [labelList, setLabelList] = useState<{ label: string; id: string }[]>([]);
	const [lastChild, setLastChild] = useState<CategoryType[0]>();
	const [fieldCharac, setFieldCharac] = useState<FieldOptionsType>([]);
	const [productSelect, setProductSelect] = useState<CategoryType[0]>();
	const { valueInput, filesData } = useInputCategorie((state) => state);
	const muatation = useCreateProductMutation();
	useEffect(() => {
		const childs = getChildCategorie(null);
		setChildsCategorie(childs);
	}, []);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProductSchemaType>({
		resolver: zodResolver(ProductSchema),
	});
	const getChildCategorie = (categorieId: string | null) => {
		const allChild = get_children(categorieId, data);
		if (allChild.length == 0) {
			const cat = getCategorieById(categorieId || '', data);
			const characteristics = get_caracteristique_child(cat?.id || null, data);
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
			if (prev.length == 1) {
				const u = prev.slice(0, -prev.length);
				return u;
			}
			return prev.slice(0, -1);
		});
	};

	const forwad = (id: string) => {
		const cat = getCategorieById(id, data);
		if (!cat) return;
		setLabelList((prev) => {
			if (cat.parent_category_id == null) {
				if (prev.length == 1) {
					prev.slice(1, -prev.length);
					return [...prev];
				}
			}
			const index = prev.findIndex((c) => c.label == cat.label);
			if (index == -1 && cat.is_parentable === 0) {
				return [...prev, { label: cat.label, id: cat.id }];
			}
			if (cat.is_parentable === 1) {
				setProductSelect(cat);
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
			return ToastWarn('vous devez ajouter au moins une image');
		}
		for (const [key, value] of Object.entries(valueInput)) {
			if (!value && value !== 0) {
				ToastWarn('le champ ' + key + ' est obligatoire');
				return;
			}
		}
		muatation.mutate({
			...data,
			category_id: productSelect?.id,
			caracteristique: valueInput,
			// photos: filesData,
		});
		console.log({
			...data,
			category_id: productSelect?.id,
			caracteristique: valueInput,
			// photos: filesData,
		});
	};

	useCallback(
		() => () => {
			if (muatation.isSuccess) {
				ToastSuccess('Produit crée avec succès');
			}
			if (muatation.isError) {
				ToastError('Une erreur est survenue lors de la création du produit');
			}
		},
		[muatation.isSuccess, muatation.isError]
	);

	return (
		<div className="mt-8 ">
			<div className="grid grid-cols-6 gap-x-5 border-slate-800">
				<div className="col-start-1 col-end-3 mx-3 min-w-[300px]  border-slate-800">
					<div className="flex items-center justify-center gap-4 rounded-md border-b-[1px] border-slate-800 bg-slate-800/10 py-2 text-slate-600">
						<Undo
							className="cursor-pointer rounded-full bg-blue  p-[1px] text-teal-50"
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
										className="w-full rounded-md border-b-[1px] border-slate-800 py-1 text-slate-600 duration-200 hover:scale-95 hover:bg-slate-800/10"
									>
										{cat.label}
									</button>
								</div>
							);
						})}
					</div>
				</div>
				<div className="col-start-3 col-end-7 mx-20 border-slate-800">
					<div className="flex gap-x-2">
						{Object.values(labelList).map((cat) => {
							return (
								<span key={cat.id}>
									<span className="text-sm">{cat.label} &gt;</span>
								</span>
							);
						})}
						<span className="text-base underline">{productSelect?.label}</span>
					</div>
					{fieldCharac.length == 0 && <p className="text-center">Aucune caractéristique</p>}
					<form className="mb-10 mt-5 flex min-w-[300px] flex-col items-center  justify-center">
						<InputComponent
							label="Nom du produit"
							type="text"
							name="title"
							placeholder="Nom du produit"
							register={register}
							errors={errors}
						/>
						<InputComponent
							label="prix du produit"
							name="price"
							type="number"
							placeholder="Prix du produit (FCFA)"
							register={register}
							errors={errors}
						/>
						<TextAreaComponent
							label="Description"
							name="description"
							placeholder="Description du produit"
							register={register}
							errors={errors}
						/>
						<InputFileComponent name={'photo du produit'} max={5} />
						{fieldCharac?.map((item, i) => {
							if (item.field === 'text' || item.field === 'number') {
								return <InputCategorie item={item} key={i} />;
							}
							if (item.field === 'select') {
								return <SelectCategorie key={i} values={item.enum || []} label={item.name} />;
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
							<button
								className="w-1/2 rounded-sm bg-blue p-2 text-white"
								type="submit"
								onClick={handleSubmit(onSubmit)}
							>
								creer l&apos;annonce
							</button>
						)}
					</form>
				</div>
			</div>
		</div>
	);
}
