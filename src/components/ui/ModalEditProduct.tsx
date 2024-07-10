/* eslint-disable @typescript-eslint/no-explicit-any */
import { field_annonce } from '@/lib/utils';
import { f_form_type, ProductsMinType } from '@/services/api/product_categorie';
import { useDataInputState } from '@/services/state/App/dataInputState';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { Nbr_Image_Upload } from '@/utils/constante';
import {
	getAllChildCategoriesOptions,
	getAllfeaturesOptions,
	getFeatureProductOptions,
	useUpdateMutationproduct,
} from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { memo, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import CloseModal from './CloseModal';
import InputCategorie from './InputCategorie';
import InputFileComponent from './InputFileComponent';
import PopUpComponent from './PopUpComponent';
import SelectCategorie from './SelectCategorie';

export default memo(function ModalEditProduct({
	showPopUp,
	closePopUp,
	product,
}: {
	showPopUp: boolean;
	closePopUp: () => void;
	product: ProductsMinType[0];
}) {
	// const { fieldCharac, setFieldCharac } = useDataInputState((state) => state);
	const [fieldCharac, setFieldCharac] = useState<f_form_type[]>([]);
	const resetInput = useInputCategorie((state) => state.resetAll);
	const filesData = useInputCategorie((state) => state.filesData);
	const { data: features } = useSuspenseQuery(getAllfeaturesOptions());
	const { data: featuresProduct } = useSuspenseQuery(getFeatureProductOptions(product.product_id));
	const { data: categories } = useSuspenseQuery(getAllChildCategoriesOptions());
	const dataProduct = useInputCategorie((state) => state.dataProduct);
	const dataFeatureProduct = useInputCategorie((state) => state.dataProductFeature);

	// const collectFeatures = (Ids: string[]) => {
	// 	setFieldCharac([]);
	// 	const newFeatures: f_form_type[] = [];
	// 	Ids.forEach((id) => {
	// 		const feature = features.filter((feature) => {
	// 			return feature.category_id === id;
	// 		});
	// 		newFeatures.push(...feature);
	// 	});
	// 	setFieldCharac(newFeatures);
	// };
	const mutation = useUpdateMutationproduct();
	const getValueFeature = (id: string) => {
		return featuresProduct.find((feature) => feature.feature_id === id)?.value;
	};

	useEffect(() => {
		const featuresId = featuresProduct.map((feature) => feature.feature_id);
		const fieldcharac = featuresId.map((id) => {
			return features.find((f) => f.id === id)!;
		});
		const tr = fieldcharac?.filter(f => Boolean(f?.id))
		setFieldCharac(tr);
		return () => {
			resetInput();
			setFieldCharac([]);
		};
	}, [featuresProduct]);

	useMemo(() => {
		if (mutation.isSuccess) {
			closePopUp();
		}
	}, [mutation.isSuccess]);
	// const onSubmit = (data: ProductSchemaType) => {
	// 	if (filesData.length == 0) {
	// 		return ToastWarn('vous devez ajouter au moins une image');
	// 	}
	// 	for (const [key, value] of Object.entries(valueInput)) {
	// 		if (!value && value !== 0) {
	// 			ToastWarn('le champ ' + key + ' est obligatoire');
	// 			return;
	// 		}
	// 	}
	// 	mutation.mutate({
	// 		dataProduct: {
	// 			...data,
	// 			product_id: product.product_id,
	// 			caracteristique: JSON.stringify(valueInput)
	// 		},
	// 		photosFile: filesData,
	// 	});
	// };
	return (
		<PopUpComponent
			styleContainer="flex items-center justify-center"
			isOpen={showPopUp}
			setHide={closePopUp}
		>
			<div
				className={` flex max-h-[90vh] min-w-[400px] max-w-[450px] flex-col items-center justify-center rounded-lg bg-white`}
			>
				<div className={' flex items-center justify-center shadow-md'}>
					<CloseModal closePopUp={closePopUp} style="text-red-600" />
					<span className={'text-center text-xl'}>Modifier votre annonce</span>
				</div>
				<div className="flex max-h-[80vh] flex-col overflow-y-auto bg-white p-2">
					<InputCategorie
						valueSave={product.title}
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
						valueSave={product.price}
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
						valueSave={product.description}
						item={{
							name: field_annonce[2],
							collect_type: 'textarea',
							placeholder: "Description de l'annonce",
							required: 1,
							min: 3,
							max: 850,
							match: /^[a-zA-Z0-9À-ÖØ-öø-ÿ\s()x.-\\&,/]+$/g,
							id: '',
						}}
					/>
					<InputFileComponent name={"photo de l'annonce"} max={Nbr_Image_Upload} />
					{fieldCharac.map((item, i) => {
						if (item.collect_type === 'text' || item.collect_type === 'number') {
							return (
								<InputCategorie valueSave={getValueFeature(item.id)} isfeature={true} item={item} key={i} />
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
									defaultValue={getValueFeature(item.id)}
								/>
							);
						}
					})}

					<div className="my-4 flex w-full flex-row items-center justify-center gap-x-2">
						<button
							disabled={mutation.isPending}
							className={twMerge('w-1/2 rounded-sm bg-primary p-2 text-white my-4')}
							type="submit"
							// onClick={handleSubmit(onSubmit)}
						>
							{mutation.isPending ? 'Modification en cours...' : "Modifier l'annonce"}
						</button>
					</div>
				</div>
			</div>
		</PopUpComponent>
	);
}, areEqual);

function areEqual(prevProps: any, nextProps: any) {
	return prevProps.showPopUp === nextProps.showPopUp;
}
