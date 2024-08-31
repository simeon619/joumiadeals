/* eslint-disable @typescript-eslint/no-explicit-any */
import { field_annonce, onCreateProduct } from '@/lib/utils';
import { f_form_type, ProductsMinType } from '@/services/api/product_categorie';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { Nbr_Image_Upload } from '@/utils/constante';
import {
	getAllfeaturesOptions,
	getFeatureProductOptions,
	useUpdateMutationproduct,
} from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import CloseModal from './CloseModal';
import InputCategorie from './InputCategorie';
import InputFileComponent from './InputFileComponent';
import PopUpComponent from './PopUpComponent';
import SelectCategorie from './SelectCategorie';

export default function ModalEditProduct({
	showPopUp,
	closePopUp,
	product,
}: {
	showPopUp: boolean;
	closePopUp: () => void;
	product: ProductsMinType[0] | undefined;
}) {
	const [fieldCharac, setFieldCharac] = useState<f_form_type[]>([]);
	const resetInput = useInputCategorie((state) => state.resetAll);
	const setFiles = useInputCategorie((state) => state.setFile);
	const dataFeatureProduct = useInputCategorie((state) => state.dataProductFeature);
	const set = useInputCategorie((state) => state.setDataProductFeature);
	const dataProduct = useInputCategorie((state) => state.dataProduct);
	const errorInput = useInputCategorie((state) => state.errorInput);
	const filesData = useInputCategorie((state) => state.filesData);
	const { data: features } = useSuspenseQuery(getAllfeaturesOptions());
	const { data: featuresProduct } = useSuspenseQuery(getFeatureProductOptions(product?.product_id));
	useEffect(() => {
		if (!product) return;
		setFiles(product.photos);
	}, [product?.product_id]);
	const {
		mutate: updateProduct,
		isSuccess: isSuccessUpdate,
		isPending: isPendingUpdate,
	} = useUpdateMutationproduct();
	const getValueFeature = (id: string) => {
		const value = featuresProduct.find((feature) => feature.feature_id == id)?.value;
		return value;
	};
	useEffect(() => {
		if (!product) return;

		// Créez une copie de dataProduct pour éviter les mutations directes
		const updatedDataProduct = { ...dataProduct };

		updatedDataProduct[field_annonce[0]] = product?.title;
		updatedDataProduct[field_annonce[1]] = product?.price;
		updatedDataProduct[field_annonce[2]] = product?.description;

		// Maintenant, vous pouvez mettre à jour le state ou la variable appropriée
		set(updatedDataProduct); // Assurez-vous d'avoir cette fonction setDataProduct
	}, [product, field_annonce]);

	useEffect(() => {
		const featuresId = featuresProduct.map((feature) => feature.feature_id);
		const fieldcharac = featuresId.map((id) => {
			return features.find((f) => f.feature_id === id)!;
		});
		const tr = fieldcharac?.filter((f) => Boolean(f?.feature_id));
		setFieldCharac(tr);
		return () => {
			resetInput();
			setFieldCharac([]);
		};
	}, [features, featuresProduct, resetInput]);

	useEffect(() => {
		if (isSuccessUpdate) {
			closePopUp();
		}
	}, [isSuccessUpdate]);
	if (!product) {
		return <></>;
	}
	return (
		<PopUpComponent
			styleContainer="flex items-center select-none size-full justify-center"
			isOpen={showPopUp}
			setHide={closePopUp}
		>
			<div
				role="presentation"
				className={`flex max-h-[90vh] min-w-[400px] max-w-[450px] select-none flex-col items-center justify-center rounded-lg bg-white/40`}
				draggable={false}
				onDrag={(e) => {
					e.preventDefault();
				}}
			>
				<div className={' flex items-center justify-center shadow-md'}>
					<CloseModal closePopUp={closePopUp} style="text-red-600" />
					<span className={'text-center text-xl'}>Modifier votre annonce</span>
				</div>
				<div className="flex max-h-[80vh] flex-col overflow-y-auto p-2">
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
							feature_id: '',
							// id: '',
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
							// id: '',
							feature_id: '',
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
							match: /^[a-zA-Z0-9À-ÖØ-öø-ÿ\s()x.-\\&,/]+$/g,
							feature_id: '',
							// id: '',
						}}
					/>
					<InputFileComponent name={"photo de l'annonce"} max={Nbr_Image_Upload} />
					{fieldCharac.map((item, i) => {
						if (item.collect_type === 'text' || item.collect_type === 'number') {
							return (
								<InputCategorie
									valueSave={getValueFeature(item.feature_id)}
									isfeature={true}
									item={item}
									key={i}
								/>
							);
						}
						if (item.collect_type === 'select') {
							return (
								<SelectCategorie
									key={i}
									id={item.feature_id}
									values={item.enum || []}
									isfeature={true}
									label={item.name}
									required={Boolean(item.required)}
									defaultValue={getValueFeature(item.feature_id)}
								/>
							);
						}
					})}

					<div className="my-4 flex w-full flex-row items-center justify-center gap-x-2">
						<button
							disabled={isPendingUpdate}
							className={twMerge('w-1/2 rounded-sm bg-primary p-2 text-white my-4')}
							type="submit"
							onClick={() =>
								onCreateProduct({
									createProduct: updateProduct,
									dataFeatureProduct,
									dataProduct: dataProduct,
									fieldSelectOne: product.category_id,
									errorInput,
									filesData,
									product_id: product.product_id,
								})
							}
						>
							{isPendingUpdate ? 'Modification en cours...' : "Modifier l'annonce"}
						</button>
					</div>
				</div>
			</div>
		</PopUpComponent>
	);
}
