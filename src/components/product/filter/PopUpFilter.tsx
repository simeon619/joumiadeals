/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseModal from '@/components/ui/CloseModal';
import PopUpComponent from '@/components/ui/PopUpComponent';
import { productsRoot } from '@/lib/route';
import { CatCreateType } from '@/lib/utils';
import { f_form_type } from '@/services/api/product_categorie';
import { useSearchFilter, useShowPopupFilter } from '@/services/state/App/filterState';
import { get_children, getCategorieById } from '@/utils/mock/Menucaegorie';
import { getAllChildCategoriesOptions, getAllfeaturesOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { AlignRight, ArrowLeftFromLine, ChevronRight, Search } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
const filterProductSchema = z.object({
	price_min: z.number(),
	price_max: z.number(),
});

export type FilterProductType = z.infer<typeof filterProductSchema>;

const SearchSchema: f_form_type[] = [
	{
		name: 'prix',
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
		name: 'Tri',
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
const className = {
	input: `rounded-s-xl  border w-[120px] border-slate-300 bg-white p-[10px] shadow-sm placeholder:text-slate-400 hover:border-filt focus:border-filt focus:outline-none focus:ring-1 focus:ring-filt sm:text-sm`,
};

export default memo(function PopUpFilter({ setShowPopup }: { setShowPopup: () => void }) {
	const { value } = useShowPopupFilter((state) => state);
	const { data: features } = useSuspenseQuery(getAllfeaturesOptions());
	const { data: categories } = useSuspenseQuery(getAllChildCategoriesOptions());
	const [fieldCharac, setFieldCharac] = useState<f_form_type[]>([]);
	const [detailFilt, setDetailFilt] = useState<string>('');
	const [parent_cat, setParent_cat] = useState<CatCreateType>();
	const [showSearchCat, setShowSearchCat] = useState(false);
	const [stepC, setStepC] = useState<string[]>([]);
	console.log('🚀 ~ PopUpFilter ~ stepC:', stepC);
	const [result_cat, setResult_cat] = useState<CatCreateType[]>([]);
	const filter = useSearchFilter((state) => state.value);
	// const { filter   } = productsRoot.useSearch({});
	const [storeFilter, setStoreFilter] = useState<
		{ value: string | Array<number>; feature_id: string }[]
	>([]);
	console.log('🚀 ~ PopUpFilter ~ storeFilter:', storeFilter);
	const navigate = useNavigate({ from: productsRoot.fullPath });
	useEffect(() => {
		const orderBy = storeFilter.find((item) => item.feature_id === '3');
		const price = storeFilter.find((item) => item.feature_id === '1');
		const newFilter = storeFilter.filter(
			(item) => item.feature_id !== '3' && item.feature_id !== '1'
		);

		console.log('🚀 ~ useEffect ~ orderBy.value:', { orderBy, price, newFilter });
		if (orderBy && orderBy.value) {
			// navigate({
			// 	search: (old) => ({
			// 		...old,
			// 		filter: {
			// 			...old.filter,
			// 			order_by: orderBy.value as 'date_asc' | 'date_desc' | 'price_asc' | 'price_desc',
			// 		},
			// 	}),
			// 	replace: true,
			// });
		}
		// if (price && price.value && Array.isArray(price.value)) {
		// 	navigate({
		// 		search: (old) => ({
		// 			...old,
		// 			filter: {
		// 				...old.filter,
		// 				price: price.value as [number, number],
		// 			},
		// 		}),
		// 		replace: true,
		// 	});
		// }
		// if (newFilter.length > 0 && Array.isArray(newFilter)) {
		// 	navigate({
		// 		search: (old) => ({
		// 			...old,
		// 			filter: {
		// 				...old.filter,
		// 				features: newFilter,
		// 			},
		// 		}),
		// 		replace: true,
		// 	});
		// }
	}, [navigate, storeFilter]);
	useEffect(() => {
		handleHierachie(null);
	}, []);

	const detail = useMemo(() => {
		return [...SearchSchema, ...fieldCharac].find((item) => item.feature_id == detailFilt);
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
		console.log('🚀 ~ collectFeatures ~ Ids:', Ids);
		setFieldCharac([]);
		const newFeatures: f_form_type[] = [];
		Ids.forEach((id) => {
			const feature = features.filter((feature) => feature.category_id === id);
			newFeatures.push(...feature);
		});
		setFieldCharac(newFeatures);
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
		setStepC([]);
	};
	// const navigate = useNavigate({ from: productsRoot.fullPath }) as any;
	// const handleStoreFilter = ({ name, value , id  }: { name: string; value: string | Array<number>,id: string }) => {
	// }
	console.log("🚀 ~ //handleStoreFilter ~ StoreFilter:", storeFilter)

	const handleFilterStore = ({
		name,
		value,
		feature_id,
		collect_type,
	}: {
		name: string;
		value: string | Array<number>;
		feature_id: string;
		collect_type: f_form_type['collect_type'];
	}) => {
		setStoreFilter((prev) => {
			const newState = [...prev];
			if (collect_type === 'radio') {
				const index = newState.findIndex((item) => item.feature_id === feature_id);
				if (index !== -1) {
					newState.splice(index, 1, { value, feature_id });
					return newState;
				} else {
					return [...newState, { value, feature_id }];
				}
			} else if (collect_type === 'select') {
				const index = newState.findIndex((item) => item.feature_id === feature_id && item.value === value);
				if (index !== -1) {
					newState.splice(index, 1);
					return newState;
				} else {
					return [...newState, { value, feature_id }];
				}
			} else if (collect_type === 'number') {
				const price = (newState.find((item) => item.feature_id === feature_id)?.value as Array<number>) || [];
				const index = newState.findIndex((item) => item.feature_id === feature_id);
				let min = price?.[0] ?? 0;
				let max = price?.[1] ?? 0;

				if (name.includes('Minimum')) {
					min = Number(value);
				}
				if (name.includes('Maximum')) {
					max = Number(value);
				}
				if (min === 0 && max === 0) {
					if (index !== -1) {
						newState.splice(index, 1);
					}
				} else {
					if (index !== -1) {
						newState.splice(index, 1, { value: [min, max], feature_id });
					} else {
						newState.push({ value: [min, max], feature_id });
					}
				}

				return newState;
			} else {
				return newState;
			}
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
							{detail ? detail.name : 'Filtres de recherche'}
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
								<span className="font-roboto text-[.91rem] text-filt">Tout</span>
								<ChevronRight className={' text-slate-700'} />
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
														<input
															className="size-5 p-1 accent-blue-900"
															onChange={(e) =>
																handleFilterStore({
																	name: item.name,
																	value: e.target.value,
																	feature_id: item.feature_id,
																	collect_type: item.collect_type,
																})
															}
															value={value}
															name={item.name}
															type="radio"
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
															<input
																type={'number'}
																name={value}
																inputMode="numeric"
																className={className.input}
																placeholder={value}
																onChange={(e) => {
																	handleFilterStore({
																		name: item.name + '_' + value,
																		value: e.target.value,
																		feature_id: item.feature_id,
																		collect_type: item.collect_type,
																	});
																}}
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
																<span className="text-[.851rem]  text-gray-800">{value}</span>
																<input
																	className="size-5 border border-slate-500 p-1 accent-filt transition-all duration-300 "
																	name={item.name}
																	type="checkbox"
																	onChange={(e) =>
																		handleFilterStore({
																			name: item.name,
																			value: e.target.value,
																			feature_id: item.feature_id,
																			collect_type: item.collect_type,
																		})
																	}
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
													className="ml-2 flex flex-col items-baseline justify-start gap-3"
												>
													<HeadFilt item={item} />
													<span className="w-2/3 truncate text-[.71rem] text-gray-800">
														{item.enum?.slice(1, 6).join(', ')}, {'...'}
													</span>

													<div className="flex w-full justify-between text-[.91rem] text-gray-500">
														<span className="font-roboto text-[.91rem] text-filt">Tout</span>
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
						className={clsx(' w-full flex-col gap-4', {
							flex: detailFilt && detailFilt !== 'category_id',
							hidden: detailFilt === 'category_id',
						})}
					>
						{detail?.enum?.map((value, i) => {
							if (i === 0) return null;
							return (
								<label key={i} className="mb-1 flex cursor-pointer items-baseline justify-between ">
									<span className="text-[.851rem]  text-gray-800">{value}</span>
									<input
										className="size-5 border border-slate-500 p-1 accent-filt transition-all duration-300 "
										name={detail.name}
										type="checkbox"
										onChange={(e) =>
											handleFilterStore({
												name: detail.name,
												value: e.target.value,
												feature_id: detail.feature_id,
												collect_type: detail.collect_type,
											})
										}
										value={value}
									/>
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
						<div className="flex w-full ">
							{filter?.category_id === 'all' && !result_cat[0]?.parent_category_id && (
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
						</div>
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
			<span className="ml-2 text-[.88rem] capitalize text-gray-700">{item.name}</span>
		</div>
	);
};
