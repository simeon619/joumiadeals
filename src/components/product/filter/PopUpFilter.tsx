/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseModal from '@/components/ui/CloseModal';
import PopUpComponent from '@/components/ui/PopUpComponent';
import { productsRoot } from '@/lib/route';
import { CatCreateType } from '@/lib/utils';
import { f_form_type } from '@/services/api/product_categorie';
import { useSearchFilter, useShowPopupFilter } from '@/services/state/App/filterState';
import {
	get_all_parents,
	get_children,
	get_firt_or_second_cat,
	getCategorieById,
} from '@/utils/mock/Menucaegorie';
import { getAllChildCategoriesOptions, getAllfeaturesOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { ArrowLeftFromLine, ChevronRight, Search } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
import { z } from 'zod';
import { FeatureComponentCheck } from './component/FeatureComponentCheck';

const filterProductSchema = z.object({
	price_min: z.number(),
	price_max: z.number(),
});

// export type FilterProductType = z.infer<typeof filterProductSchema>;

const SearchSchema: f_form_type[] = [
	{
		name: 'prix:price',
		collect_type: 'number',
		icon:
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJhZGdlLWNlbnQiPjxwYXRoIGQ9Ik0zLjg1IDguNjJhNCA0IDAgMCAxIDQuNzgtNC43NyA0IDQgMCAwIDEgNi43NCAwIDQgNCAwIDAgMSA0Ljc4IDQuNzggNCA0IDAgMCAxIDAgNi43NCA0IDQgMCAwIDEtNC43NyA0Ljc4IDQgNCAwIDAgMS02Ljc1IDAgNCA0IDAgMCAxLTQuNzgtNC43NyA0IDQgMCAwIDEgMC02Ljc2WiIvPjxwYXRoIGQ9Ik0xMiA3djEwIi8+PHBhdGggZD0iTTE1LjQgMTBhNCA0IDAgMSAwIDAgNCIvPjwvc3ZnPg==',
		feature_id: '1',
		ext: 'cfa',
	},
	// {
	// 	name: 'Tri par Prix',
	// 	collect_type: 'select_',
	// 	icon:
	// 		'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFycm93LWRvd24tMC0xIj48cGF0aCBkPSJtMyAxNiA0IDQgNC00Ii8+PHBhdGggZD0iTTcgMjBWNCIvPjxyZWN0IHg9IjE1IiB5PSI0IiB3aWR0aD0iNCIgaGVpZ2h0PSI2IiByeT0iMiIvPjxwYXRoIGQ9Ik0xNyAyMHYtNmgtMiIvPjxwYXRoIGQ9Ik0xNSAyMGg0Ii8+PC9zdmc+',
	// 	enum: ['price_asc', 'price_desc'],
	// 	id: '2',
	// },
	{
		name: 'Tri:order_by',
		collect_type: 'radio',
		icon:
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWFycm93LWRvd24td2lkZS1uYXJyb3ciPjxwYXRoIGQ9Im0zIDE2IDQgNCA0LTQiLz48cGF0aCBkPSJNNyAyMFY0Ii8+PHBhdGggZD0iTTExIDRoMTAiLz48cGF0aCBkPSJNMTEgOGg3Ii8+PHBhdGggZD0iTTExIDEyaDQiLz48L3N2Zz4=',
		enum: ['date_asc', 'date_desc', 'price_asc', 'price_desc'],
		feature_id: '3',
	},
	// {
	// 	name: 'Type de vendeurs',
	// 	id: '4',
	// 	collect_type: 'select',
	// 	icon: '',
	// 	enum: ['', 'Livraison', 'Paiement Main a main'],
	// },
];

const setFields = ({
	Ids,
	features,
	setFieldCharac,
}: {
	Ids: string[];
	features: f_form_type[];
	setFieldCharac: React.Dispatch<React.SetStateAction<f_form_type[]>>;
}) => {
	setFieldCharac([]);
	const newFeatures: f_form_type[] = [];
	Ids.forEach((id) => {
		const feature = features.filter((feature) => feature.category_id === id);
		newFeatures.push(...feature);
	});
	setFieldCharac(newFeatures);
};
const removeEmptyArrays = (obj: Record<string, Array<string> | string>) => {
	return Object.entries(obj)
		.filter(([_key, value]) => (Array.isArray(value) ? value.length > 0 : true))
		.reduce(
			(acc, [key, value]) => {
				acc[key] = value;
				return acc;
			},
			{} as Record<string, Array<string> | string>
		);
};
export const PopUpFilter = memo(function PopUpFilter({
	setShowPopup,
}: {
	setShowPopup: () => void;
}) {
	const { value } = useShowPopupFilter((state) => state);
	const { data: features } = useSuspenseQuery(getAllfeaturesOptions());
	const { data: categories } = useSuspenseQuery(getAllChildCategoriesOptions());
	const [fieldCharac, setFieldCharac] = useState<f_form_type[]>([]);
	const [detailFilt, setDetailFilt] = useState<string>('');
	const [parent_cat, setParent_cat] = useState<CatCreateType>();
	const [showSearchCat, setShowSearchCat] = useState(false);
	const [stepC, setStepC] = useState<string[]>([]);
	const [result_cat, setResult_cat] = useState<CatCreateType[]>([]);
	const filterFrom = useSearchFilter((state) => state.value);
	const firstMount = useRef<boolean>(false);

	const [storeFilter, setStoreFilter] = useState<Record<string, string | Array<string>>>({});
	const navigate = useNavigate({ from: productsRoot.fullPath });
	useDebounce(
		() => {
			if (firstMount.current) {
				const orderBy = storeFilter['3'];
				const price = storeFilter['1'];
				const newFilter = {
					...storeFilter,
					'3': undefined,
					'1': undefined,
				};
				if (orderBy) {
					navigate({
						search: (old) => ({
							...old,
							filter: {
								...old.filter,
								order_by: orderBy as 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc',
							},
						}),
						replace: true,
					});
				} else {
					navigate({
						search: (old) => ({
							...old,
							filter: {
								...old.filter,
								order_by: 'date_desc',
							},
						}),
						replace: true,
					});
				}
				if (
					price &&
					Array.isArray(price) &&
					price.length == 2 &&
					!isNaN(Number(price[0])) &&
					!isNaN(Number(price[1]))
				) {
					navigate({
						search: (old) => ({
							...old,
							filter: {
								...old.filter,
								price: [Number(price[0]), Number(price[1])],
							},
						}),
						replace: true,
					});
				} else {
					navigate({
						search: (old) => ({
							...old,
							filter: {
								...old.filter,
								price: undefined,
							},
						}),
						replace: true,
					});
				}
				if (newFilter && Object.keys(newFilter).length > 0) {
					navigate({
						search: (old) => ({
							...old,
							filter: {
								...old.filter,
								features: newFilter,
							},
						}),
						replace: true,
					});
				} else {
					navigate({
						search: (old) => ({
							...old,
							filter: {
								...old.filter,
								features: undefined,
							},
						}),
					});
				}
			} else {
				firstMount.current = true;
			}
		},
		300,
		[storeFilter]
	);

	useEffect(() => {
		handleHierachie(null);
	}, []);

	useEffect(() => {
		const bh = () => {
			let obj: Record<string, Array<string | number> | string> = {};
			Object.keys(filterFrom).forEach((key) => {
				if (key === 'order_by') {
					obj['3'] =
						filterFrom[key] || ('date_desc' as 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc');
				}
				if (key === 'price') {
					obj['1'] = filterFrom[key] as Array<number>;
				}
				if (key === 'features') {
					// obj[key] = filterFrom[key] as any;
					obj = { ...obj, ...filterFrom[key] };
				}
			});
			setStoreFilter(obj);
		};
		if (!firstMount.current) bh();
		const id = filterFrom.category_id;
		const Ids = get_all_parents(id || null, categories);
		setFields({ Ids, features, setFieldCharac });
	}, [filterFrom]);

	const detail = useMemo(() => {
		return [...fieldCharac, ...SearchSchema].find((item) => item.feature_id == detailFilt);
	}, [detailFilt, fieldCharac]);

	const handleHierachie = useCallback((categoryId: string | null) => {
		const result_cat = get_children(categoryId || null, categories);
		setResult_cat(result_cat);
		const parent_cat = getCategorieById(categoryId || null, categories);
		setParent_cat(parent_cat);
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
	}, []);

	useEffect(() => {
		if (result_cat.length <= 10) {
			setShowSearchCat(false);
		} else {
			const tra = result_cat.every((item) => Boolean(item.is_parentable));
			setShowSearchCat(tra);
		}
	}, [result_cat]);

	const collectFeatures = (Ids: string[]) => {
		navigate({
			search: (old) => {
				return {
					...old,
					filter: {
						...old.filter,
						category_id: Ids[Ids.length - 1],
					},
				};
			},
		});
		setFields({ Ids, features, setFieldCharac });
		setStepC([]);
	};

	const handleFilterStore = ({
		name,
		value,
		feature_id,
		collect_type,
	}: {
		name: string;
		value: string | Array<string>;
		feature_id: string;
		collect_type: f_form_type['collect_type'];
	}) => {
		setStoreFilter((prev) => {
			const newState = { ...prev };
			if (collect_type === 'radio' && typeof value === 'string') {
				newState[feature_id] = value;
			} else if (collect_type === 'select') {
				let f_value = newState[feature_id];
				if (!f_value && typeof value === 'string') {
					f_value = [value];
				} else if (Array.isArray(f_value) && typeof value === 'string') {
					if (f_value.includes(value)) {
						const index = f_value.indexOf(value);
						f_value.splice(index, 1);
					} else {
						f_value.push(value);
					}
				}
				newState[feature_id] = f_value;
			} else if (collect_type === 'number') {
				const price = newState[feature_id] as Array<string>;
				let min = price?.[0] ?? 0;
				let max = price?.[1] ?? 0;
				if (name.includes('Minimum')) {
					min = Number(value);
				}
				if (name.includes('Maximum')) {
					max = Number(value);
				}
				if (min === '0' && max === '0') {
					delete newState[feature_id];
				} else {
					newState[feature_id] = [min, max];
				}
			}
			const cleanState = removeEmptyArrays(newState);
			return cleanState;
		});
	};

	return (
		<PopUpComponent
			animationName="translateRight"
			isOpen={value}
			styleContainer={'realtive'}
			setHide={setShowPopup}
			position="end"
		>
			<div className="right-0 max-h-[100vh] min-w-[430px] max-w-[430px] overflow-hidden bg-white shadow-2xl ">
				<div
					className={clsx(
						'flex h-[5vh] w-full items-center justify-between border-b-[1px] border-slate-300 py-2 pl-8  pr-4'
					)}
				>
					<div
						className={clsx(
							{ hidden: !detailFilt, flex: detailFilt },
							' w-full items-center justify-between '
						)}
					>
						<ArrowLeftFromLine
							onClick={() => {
								if (detailFilt === 'category_id') {
									if (result_cat[0]?.parent_category_id === null) {
										return setDetailFilt('');
									}

									return handleHierachie(parent_cat?.parent_category_id || null);
								}
								return setDetailFilt('');
							}}
							size={22}
							className={clsx('cursor-pointer rounded-full text-slate-700')}
						/>
						<span className="text-center font-semibold text-black">
							{detail ? detail.name.split(':')[0] : 'Filtres de recherche'}
						</span>
						<CloseModal closePopUp={setShowPopup} style={'size-6'} />
					</div>
					<div
						className={clsx(
							{ hidden: detailFilt, flex: !detailFilt },
							' w-full items-center justify-between '
						)}
					>
						<span className="text-center font-semibold text-black">Tous les filtres</span>
						<CloseModal closePopUp={setShowPopup} style={'size-6'} />
					</div>
				</div>
				<div
					className={
						'flex max-h-[95vh] min-h-[95vh] w-full self-center justify-self-center overflow-y-auto py-2 pl-5  pr-4'
					}
				>
					<div
						className={clsx(' w-full flex-col gap-1 divide-y-2', {
							flex: !detailFilt,
							hidden: detailFilt,
						})}
					>
						<button
							onClick={() => {
								setDetailFilt('category_id');
							}}
							className="ml-2 flex flex-col items-baseline justify-start gap-3 py-3"
						>
							<span className="text-[.88rem] text-gray-800">Categorie</span>
							<div className="flex w-full justify-between text-[.91rem] text-gray-500">
								<span className="font-roboto text-[.91rem] text-filt">
									{get_firt_or_second_cat(filterFrom.category_id || null, categories)?.label || 'Tout'}
								</span>
								<ChevronRight className={'text-slate-700'} />
							</div>
						</button>
						{[...fieldCharac, ...SearchSchema].map((item) => {
							return (
								<div key={item.feature_id} className="flex w-full flex-col gap-1 py-5">
									{item.collect_type === 'radio' && (
										<>
											<HeadFilt item={item} />
											{item.enum?.map((value, i) => {
												const mapData: any = {
													price_asc: 'Prix croissant',
													price_desc: 'Prix décroissant',
													date_asc: 'plus anciennes',
													date_desc: 'plus recentes',
												};
												return (
													<label key={i} className="mb-1 flex cursor-pointer items-baseline justify-between ">
														<span className="text-[.87rem] text-gray-800 ">{mapData[value]}</span>
														<FeatureComponentCheck
															handleFilterStore={handleFilterStore}
															item={item}
															value={value}
														/>
													</label>
												);
											})}
										</>
									)}
									{item.collect_type === 'number' && (
										<>
											<HeadFilt item={item} />
											<div className="ml-2 flex items-baseline justify-start gap-3">
												{['Minimum', 'Maximum'].map((value, i) => {
													return (
														<div key={i} className={'flex justify-start'}>
															<FeatureComponentCheck
																handleFilterStore={handleFilterStore}
																item={item}
																value={value}
															/>
															<div className="flex items-center justify-center rounded-e-xl border-y border-r border-gray-300 bg-slate-100 px-3 py-2 text-[.805rem] uppercase text-gray-500">
																{item.ext}
															</div>
														</div>
													);
												})}
											</div>
										</>
									)}
									{item.collect_type === 'select' && (
										<>
											{(item.enum?.length || 0) < 5 ? (
												<>
													<HeadFilt item={item} />
													{item.enum?.map((value, i) => {
														if (i === 0) return null;
														return (
															<label key={i} className="mb-1 flex cursor-pointer items-baseline justify-between ">
																<span className="text-[.811rem] capitalize text-slate-800">{value}</span>
																<FeatureComponentCheck
																	handleFilterStore={handleFilterStore}
																	item={item}
																	value={value}
																/>
															</label>
														);
													})}
												</>
											) : (
												<button
													onClick={() => {
														setDetailFilt(item.feature_id);
													}}
													className="flex w-full flex-col items-baseline justify-start gap-3"
												>
													<HeadFilt item={item} />
													<div className="flex w-2/3 truncate">
														<span className="truncate text-left font-roboto text-[.72rem] text-slate-700">
															{item.enum?.slice(1, 6).join(', ')}
														</span>
													</div>

													<div className="flex w-full justify-between text-[.91rem] text-gray-500">
														<span className="font-roboto text-[.75rem] text-filt">
															{filterFrom?.features?.[item.feature_id]?.slice(0, 6).join(', ') || 'Tous'}
														</span>
														<ChevronRight className={' text-slate-700'} />
													</div>
												</button>
											)}
										</>
									)}
								</div>
							);
						})}
					</div>
					<div
						className={clsx('w-full flex-col gap-4', {
							flex: detailFilt && detailFilt !== 'category_id',
							hidden: detailFilt === 'category_id',
						})}
					>
						{detail?.enum?.map((value, i) => {
							if (i === 0) return null;
							return (
								<label key={i} className="mb-1 flex cursor-pointer items-baseline justify-between ">
									<span className="text-[.851rem]  text-gray-800">{value}</span>
									<FeatureComponentCheck handleFilterStore={handleFilterStore} item={detail} value={value} />
								</label>
							);
						})}
					</div>
					<div
						className={clsx(' w-full flex-col gap-4', {
							flex: detailFilt && detailFilt == 'category_id',
							hidden: detailFilt !== 'category_id',
						})}
					>
						{/* <div className="flex w-full ">
							{filterFrom?.category_id === 'all' && !result_cat[0]?.parent_category_id && (
								<>
									<button
										onClick={() => handleHierachie(null)}
										className="flex items-center justify-center gap-2 text-sm"
									>
										<AlignRight size={20} />
										<span>Toutes les catégories</span>
									</button>
								</>
							)}
						</div> */}
						<div className="flex w-full flex-col items-start justify-start divide-y ">
							<div
								className={clsx('my-2 flex items-center rounded-xl border p-1', {
									block: showSearchCat,
									hidden: !showSearchCat,
								})}
							>
								<Search size={16} className="m-1 text-gray-400" />
								<input
									type="text"
									placeholder="Recherche une valeur"
									className="border-none p-1 text-sm outline-none"
								/>
							</div>

							{parent_cat ? (
								<div className="flex w-full flex-row items-baseline justify-around hover:bg-gray-100">
									<button
										className={clsx('flex w-full items-center justify-start gap-2 py-4 font-poppins')}
										onClick={() => {
											handleHierachie(null);
											collectFeatures(stepC);
											setDetailFilt('');
										}}
									>
										<img
											src={parent_cat.icon || ''}
											className="size-4"
											alt=""
											style={{ filter: 'invert(0.30)' }}
										/>
										<span className={clsx('text-[.83rem] font-semibold')}> {parent_cat?.label}</span>
									</button>
									<ChevronRight className={clsx('text-slate-600')} />
								</div>
							) : null}
							{result_cat?.map((cat) => {
								return (
									<div
										className="flex w-full flex-row items-baseline justify-around hover:bg-gray-100"
										key={cat.id}
									>
										<button
											className={clsx('flex w-full items-center justify-start gap-2 py-4 font-poppins ')}
											onClick={() => {
												if (cat.is_parentable) {
													collectFeatures([stepC, cat.id].flat());
													handleHierachie(null);
													return setDetailFilt('');
												}
												handleHierachie(cat?.id);
											}}
										>
											<img src={cat.icon || ''} className="size-4" alt="" style={{ filter: 'invert(0.30)' }} />
											<span className={clsx('text-[.83rem]')}>{cat.label}</span>
										</button>
										<ChevronRight
											className={clsx({
												' text-slate-300': !cat.is_parentable,
												'rotate-90': !!cat.is_parentable,
											})}
										/>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</PopUpComponent>
	);
});

const HeadFilt = ({ item }: { item: any }) => {
	return (
		<div className="mb-1 flex items-center ">
			<img className="size-6 rounded-full bg-blue-100 p-1 invert-20" src={item.icon} alt={''} />
			<span className="ml-2 font-roboto text-[.95rem] capitalize text-slate-900">
				{item.name.split(':')[0]}
			</span>
		</div>
	);
};
