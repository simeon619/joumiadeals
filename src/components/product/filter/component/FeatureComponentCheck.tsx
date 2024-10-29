/* eslint-disable @typescript-eslint/no-explicit-any */
import { f_form_type } from '@/services/api/product_categorie';
import { useSearchFilter } from '@/services/state/App/filterState';
import { FilterProductType } from '@/utils/queryOptions';
import { useEffect, useState } from 'react';
const className = {
	input: `rounded-s-xl  border w-[110px] border-slate-300 bg-white p-[7px] shadow-sm placeholder:text-slate-400 hover:border-filt focus:border-filt focus:outline-none focus:ring-1 focus:ring-filt text-sm`,
};
function areArraysEqual(arr1: string | Array<number>, arr2: string | Array<number>) {
	if (typeof arr1 !== typeof arr2) return false;
	if (typeof arr1 === 'string' && typeof arr2 === 'string') {
		return arr1 === arr2;
	}
	if (Array.isArray(arr1) && Array.isArray(arr2)) {
		if (arr1.length !== arr2.length) return false;
		return arr1.every((value, index) => value === arr2[index]);
	}
	return false;
}
export default function FeatureComponentCheck({
	item,
	value,
	handleFilterStore,
}: {
	item: f_form_type;
	value: string | Array<string>;
	handleFilterStore: ({
		name,
		value,
		feature_id,
		collect_type,
	}: {
		name: string;
		value: string | Array<string>;
		feature_id: string;
		collect_type: f_form_type['collect_type'];
	}) => void;
}) {
	const filterFrom = useSearchFilter((state) => state.value);
	const [valInput, setValInput] = useState<string | Array<string>>(value);
	const getValueFeature = ({
		id,
		keyFilter,
	}: {
		id: string;
		keyFilter: keyof FilterProductType;
	}) => {
		const featureId = !keyFilter ? 21 : Number(id);
		const isInFeature = featureId <= 20;
		if (isInFeature) {
			return filterFrom[keyFilter];
		} else {
			return filterFrom?.['features']?.[id];
		}
	};
	const [checked, setChecked] = useState(false);
	useEffect(() => {
		const result = getValueFeature({
			id: item.feature_id,
			keyFilter: item.name.split(':')[1] as keyof FilterProductType,
		});
		if (item.collect_type === 'select' || item.collect_type === 'radio') {
			setChecked((result as Array<string>)?.includes(value as string));
		} else {
			setValInput(result as any);
		}
	}, [filterFrom, value]);

	const getV = (name: string) => {
		if (name.includes('Minimum')) {
			return Array.isArray(valInput) ? valInput[0] : undefined;
		} else if (name.includes('Maximum')) {
			return Array.isArray(valInput) ? valInput[1] : undefined;
		} else {
			return undefined;
		}
	};
	const mapData: any = {
		price_asc: 'Prix croissant',
		price_desc: 'Prix décroissant',
		date_asc: 'plus anciennes',
		date_desc: 'plus recentes',
	};
	return (
		<>
			{item.collect_type === 'radio' && (
				<>
					<label
						htmlFor={String(value)}
						className="mb-1 flex w-full cursor-pointer items-baseline justify-between text-[.87rem]"
						onClick={() => {
							handleFilterStore({
								collect_type: 'radio',
								name: item.name.split(':')[0],
								value: value,
								feature_id: item.feature_id,
							});
						}}
						aria-hidden="true"
					>
						<span className="text-[.87rem] capitalize text-gray-800">{mapData[value] || value}</span>

						<input
							className="size-5 p-1 capitalize accent-filt"
							onChange={() => {
								handleFilterStore({
									collect_type: 'radio',
									name: item.name.split(':')[0],
									value: value,
									feature_id: item.feature_id,
								});
							}}
							name="data:radio"
							id={String(value)}
							type="radio"
							checked={checked}
						/>
					</label>
				</>
			)}

			{item.collect_type === 'number' && (
				<input
					type={'number'}
					name={String(value)}
					inputMode="numeric"
					className={className.input}
					placeholder={String(value)}
					onChange={(e) => {
						handleFilterStore({
							name: item.name + '_' + value,
							value: e.target.value,
							feature_id: item.feature_id,
							collect_type: item.collect_type,
						});
					}}
					value={getV(item.name + '_' + value || '')}
				/>
			)}
			{item.collect_type === 'select' && (	
				<>
					<label
						onClick={() =>
							handleFilterStore({
								name: item.name,
								value,
								feature_id: item.feature_id,
								collect_type: item.collect_type,
							})
						}
						className="mb-1 flex cursor-pointer items-baseline justify-between "
						aria-hidden="true"
					>
						<span className="text-[.811rem] capitalize text-slate-800">{value}</span>
						<input
							className="size-5 border border-slate-500 p-1 capitalize accent-filt transition-all duration-300 "
							// name={item.name}
							type="checkbox"
							onChange={() => {
								handleFilterStore({
									name: item.name.split(':')[0],
									value: value,
									feature_id: item.feature_id,
									collect_type: item.collect_type,
								});
							}}
							checked={checked || false}
						/>
					</label>
				</>
			)}
		</>
	);
}
