/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import InputComponent from './InputComponent';
import InputFileComponent from './InputFileComponent';
import DateInputCategori from './DateInputCategori';
import PopUpComponent from './PopUpComponent';
import TextAreaComponent from './TextAreaComponent';
import InputCategorie from './InputCategorie';
import SelectCategorie from './SelectCategorie';
import SwitchInputCategori from './SwitchInputCategori';
import { Nbr_Image_Upload } from '@/utils/constante';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { FieldOptionsType, ProductsData, ProductsMinType } from '@/services/api/product_categorie';
import { useForm } from 'react-hook-form';
import { ProductSchema, ProductSchemaType } from '@/pages/index/CreateProduct';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useUpdateMutationproduct } from '@/utils/queryOptions';
import { ToastWarn } from '@/lib/utils';
import CloseModal from './CloseModal';

export default memo(function ModalEditProduct({
	showPopUp,
	closePopUp,
	product,
	fieldCharac,
}: {
	showPopUp: boolean;
	closePopUp: () => void;
	product: ProductsMinType[0];
	fieldCharac: FieldOptionsType;
}) {
	const resetInput = useInputCategorie((state) => state.resetAll);
	const filesData = useInputCategorie((state) => state.filesData);
	const valueInput = useInputCategorie((state) => state.valueInput);
	const mutation = useUpdateMutationproduct();

	useEffect(() => {
		return () => {
			resetInput();
		};
	}, []);

	useMemo(() => {
		if (mutation.isSuccess) {
			closePopUp();
		}
	}, [mutation.isSuccess]);
	const onSubmit = (data: ProductSchemaType) => {
		if (filesData.length == 0) {
			return ToastWarn('vous devez ajouter au moins une image');
		}
		for (const [key, value] of Object.entries(valueInput)) {
			if (!value && value !== 0) {
				ToastWarn('le champ ' + key + ' est obligatoire');
				return;
			}
		}
		mutation.mutate({
			dataProduct: {
				...data,
				product_id: product.product_id,
				caracteristique: JSON.stringify(valueInput),
			},
			photosFile: filesData,
		});
	};
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ProductSchemaType>({ resolver: zodResolver(ProductSchema) });
	return (
		<PopUpComponent
			styleContainer="absolute flex  items-center justify-center h-full w-full"
			isOpen={showPopUp}
		>
			<div
				className={`flex h-2/3 w-[600px] flex-col items-center justify-center rounded-lg bg-white `}
			>
				<div
					className={
						'sticky inset-x-0 top-0 z-40 flex w-full items-center justify-center bg-slate-100 py-2 shadow-md'
					}
				>
				<CloseModal closePopUp={closePopUp}/>
					<span className={'text-center text-3xl'}>Modifier votre annonce</span>
				</div>
				<div className={twMerge('overflow-y-scroll', ' min-w-[260px] max-w-[470px]')}>
					<div className={'w-[250px] min-w-[300px] max-w-[370px]'}></div>
					<form className="mt-5 flex min-w-[230px] flex-col items-center  justify-center">
						<InputComponent
							label="Titre de l'annonce"
							type="text"
							name="title"
							placeholder="Nom de l'annonce"
							register={register}
							errors={errors}
							defaultValue={product.title}
						/>
						<InputComponent
							label="prix de l'annonce"
							name="price"
							type="number"
							placeholder="Prix de l'annonce (FCFA)"
							register={register}
							defaultValue={product.price}
							errors={errors}
						/>
						<TextAreaComponent
							label="Description"
							name="description"
							placeholder="Description de l'annonce"
							register={register}
							defaultValue={product.description}
							errors={errors}
						/>
						<InputFileComponent name={'photo de l\'annonce'} max={Nbr_Image_Upload} />
						{fieldCharac?.map((item, i) => {
							if (item.field === 'text' || item.field === 'number') {
								const defaultValue = product.caracteristique[item.name];
								return <InputCategorie item={{ ...item, default: defaultValue }} key={i} />;
							}
							if (item.field === 'select') {
								const defaultValue = product.caracteristique[item.name];
								return (
									<SelectCategorie
										key={i}
										values={item.enum || []}
										defaultValue={defaultValue}
										label={item.name}
									/>
								);
							}
							if (item.field === 'date') {
								const defaultValue = product.caracteristique[item.name];
								return <DateInputCategori item={{ ...item, default: defaultValue }} key={i} />;
							}
							if (item.field === 'checkbox') {
								const defaultValue = product.caracteristique[item.name];
								return <SwitchInputCategori item={{ ...item, default: defaultValue }} key={i} />;
							}
						})}

						<div className="my-4 flex w-full flex-row items-center justify-center gap-x-2">
							<button
								disabled={mutation.isPending}
								className={twMerge('w-1/2 rounded-sm bg-primary p-2 text-white my-4')}
								type="submit"
								onClick={handleSubmit(onSubmit)}
							>
								{mutation.isPending ? 'Modification en cours...' : "Modifier l'annonce"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</PopUpComponent>
	);
}, areEqual);

function areEqual(prevProps: any, nextProps: any) {
	return prevProps.showPopUp === nextProps.showPopUp;
}
