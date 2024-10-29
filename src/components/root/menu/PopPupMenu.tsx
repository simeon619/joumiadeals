/* eslint-disable @typescript-eslint/no-explicit-any */
import CloseModal from '@/components/ui/CloseModal';
import Name from '@/components/ui/Name';
import PopUpComponent from '@/components/ui/PopUpComponent';
import {
	createProductRoot,
	discussionRoot,
	favouriteRoot,
	productsRoot,
	visitedRoot,
} from '@/lib/route';
import { CatCreateType, MenuCat } from '@/lib/utils';
import { useAuth } from '@/services/state/User/auth';
import { BuildMenu, get_children } from '@/utils/mock/Menucaegorie';
import { getAllChildCategoriesOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import {
	ArrowLeft,
	ChevronRight,
	CircleFadingPlus,
	Heart,
	HistoryIcon,
	MessageCircle,
	SearchCodeIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const className = {
	itemMenu: 'flex items-center justify-start gap-2 py-3 px-2 ',
	itemTextMenu: 'text-[.95rem] font-roboto text-slate-800',
};

interface MenuCatType {
	[key: string]: any; // Replace `any` with the actual type you expect
}

export default function PopPupMenu({
	setClosePopup,
	showMenu,
}: {
	setClosePopup: () => void;
	showMenu: boolean;
}) {
	const MenuI1 = {
		putAnnounce: {
			icon: <CircleFadingPlus size={18} />,
			text: 'Deposer une annonce',
			path: createProductRoot.to,
		},
		search: {
			icon: <SearchCodeIcon size={18} />,
			text: 'Rechercher',
			path: productsRoot.to,
			search: {
				filter: {
					category_id: 'all',
					order_by: 'date_asc',
					status: 5,
				},
				page: 1,
			},
		},
	} as const;

	const MenuI2 = {
		putAnnounce: {
			icon: <MessageCircle size={18} />,
			text: 'Messages',
			path: discussionRoot.to,
			search: {
				filter: { type: 'private' },
			},
		},
		search: {
			icon: <Heart size={18} />,
			text: 'Favoris',
			path: favouriteRoot.to,
			search: {
				page: 1,
			},
		},
		Historique: {
			icon: <HistoryIcon size={18} />,
			text: 'Historique',
			path: visitedRoot.to,
			search: {
				page: 1,
			},
		},
	} as const;
	const [result_cat, setResult_cat] = useState<CatCreateType[]>([]);
	const { data: categories } = useSuspenseQuery(getAllChildCategoriesOptions());
	const [tab, setTab] = useState<string>();

	const navigate = useNavigate();
	const isAuth = useAuth((state) => state.isAuth);
	useEffect(() => {
		if (categories) {
			BuildMenu(null, MenuCat, 0, categories);
		}
	}, [categories]);

	const navTo = (path: string, search?: object) => {
		navigate({ to: path, search });
		setClosePopup();
	};

	useEffect(() => {
		const handleHierachie = (categoryId: string | null) => {
			const result_cat = get_children(categoryId || null, categories);
			setResult_cat(result_cat);
		};
		handleHierachie(null);
	}, []);
	return (
		<PopUpComponent
			isOpen={showMenu}
			setHide={setClosePopup}
			styleContainer={'flex w-full'}
			position="start"
			animationName="translateLeft"
			zIndex={65}
		>
			<div className="right-0 grid w-[420px] max-w-[420px] grid-rows-[50px_1fr_40px]  overflow-hidden bg-white shadow-2xl xs:w-screen ">
				<>
					{tab ? (
						<div className=" flex items-center justify-start gap-2 border-b-4 border-primary pl-4 shadow-sm">
							<ArrowLeft
								className="size-8 text-gray-500"
								onClick={() => {
									setTab('');
								}}
							/>
							<span className="text-lg">{tab?.split(':')[0]}</span>
						</div>
					) : (
						<div className="relative flex items-center justify-center shadow-sm">
							<Name />
							<CloseModal closePopUp={setClosePopup} style={'size-7 absolute right-2 text-gray-500'} />
						</div>
					)}
				</>
				<div className="overflow-auto">
					{tab ? (
						<div className="px-4">
							<button
								onClick={() => {
									navTo(productsRoot.to, { filter: { category_id: tab.split(':')[1], status: 5 }, page: 1 });
								}}
								className="cursor-pointer border-b-[1px] border-black py-3 text-[0.96rem] text-slate-600 hover:text-primary"
							>
								Tout {tab.split(':')[0]}
							</button>
							{Object.keys(MenuCat[tab]).map((key) => {
								if (key === 'icon') return null;
								const [subCategoryName, subCategoryId] = key.split(':');
								const categoryData = MenuCat[tab][key];
								return (
									<div
										key={key}
										className="flex flex-col items-start justify-center gap-2 border-b-[1px] border-black  py-3"
									>
										<button
											onClick={() => {
												navTo(productsRoot.to, { filter: { category_id: subCategoryId, status: 5 }, page: 1 });
											}}
											className="text-[0.96rem] text-slate-600"
										>
											{subCategoryName}
										</button>
										<div className="flex w-full flex-col items-start justify-start">
											{(categoryData as string[]).map((item) => {
												const [itemName, itemId] = item.split(':');
												return (
													<button
														key={item}
														onClick={() => {
															navTo(productsRoot.to, { filter: { category_id: itemId, status: 5 }, page: 1 });
														}}
														className="cursor-pointer py-2 font-poppins text-[0.805rem] capitalize text-black hover:text-primary"
													>
														{itemName}
													</button>
												);
											})}
										</div>
									</div>
								);
							})}
						</div>
					) : (
						<div className="mt-2 divide-y-2 ">
							<div>
								{Object.entries(MenuI1).map(([i, { icon, text, path, search }]) => {
									return (
										<button
											onClick={() => {
												navTo(path, search);
											}}
											className={className.itemMenu}
											key={i}
										>
											{icon}
											<span className={className.itemTextMenu}>{text}</span>
										</button>
									);
								})}
							</div>
							<div
								className={clsx('flex flex-col items-start justify-center  overflow-auto', {
									hidden: !isAuth,
									flex: isAuth,
								})}
							>
								{Object.entries(MenuI2).map(([i, { icon, text, path, search }]) => {
									return (
										<button
											onClick={() => {
												navTo(path, search);
											}}
											className={className.itemMenu}
											key={i}
										>
											{icon}
											<span className={className.itemTextMenu}>{text}</span>
										</button>
									);
								})}
							</div>
							<div className={clsx('flex items-center justify-center', { hidden: isAuth, flex: !isAuth })}>
								<button className="w-full  py-2 font-bold">Se connecter</button>
							</div>
							<div className="pt-1">
								<span className="w-full py-3 pl-4 text-center text-[.8rem] text-slate-800">Categories</span>
								{result_cat?.map((cat) => {
									return (
										<button
											className="flex w-full flex-row items-baseline justify-around pl-3 pr-2 hover:bg-gray-100"
											key={cat.id}
											onClick={() => {
												const idName = cat.label + ':' + cat.id;
												setTab(idName);
											}}
										>
											<div className={clsx('flex w-full items-center justify-start gap-2 py-4 font-poppins ')}>
												<img
													src={cat.icon || ''}
													className="size-4"
													alt=""
													style={{ filter: 'invert(0.30)' }}
												/>
												<span className={clsx('text-[.8rem]')}>{cat.label}</span>
											</div>
											<ChevronRight
												className={clsx({
													'text-slate-300': !cat.is_parentable,
													'rotate-90': !!cat.is_parentable,
												})}
											/>
										</button>
									);
								})}
							</div>
						</div>
					)}
				</div>
				<div className="flex items-center justify-center">
					<span className="text-xs">Amedeals 2024 - {new Date().getFullYear()}</span>
				</div>
			</div>
		</PopUpComponent>
	);
}
{
	/* <div>
							{Object.keys(MenuCat).map((categoryKey) => {
								const categoryData = MenuCat[categoryKey as keyof typeof MenuCat];
								const [categoryName, categoryId] = categoryKey.split(':');
								
								return (
									<div
									key={categoryKey}
									className="flex w-full flex-col flex-wrap gap-5  divide-y-2 border-red-500 "
									>
										<Link
											to={productsRoot.to}
											search={{
												filter: { category_id: categoryId, status: 5 },
												page: 1,
											}}
											className="my-5 cursor-pointer px-3 font-bold capitalize text-black hover:text-primary"
										>
											Tout {categoryName}
										</Link>
										{Object.keys(categoryData).map((subCategoryKey) => {
											if (subCategoryKey === 'icon') return null;
											const [subCategoryName, subCategoryId] = subCategoryKey.split(':');
											return (
												<>
													<div key={subCategoryKey} className="flex w-full flex-col px-3">
														<Link
															to={productsRoot.to}
															search={{
																filter: { category_id: subCategoryId, status: 5 },
																page: 1,
															}}
															className="cursor-pointer text-sm font-bold capitalize text-black/90 hover:text-primary"
														>
															{subCategoryName}
														</Link>
														<div className="flex w-full flex-col">
															{(categoryData[subCategoryKey] as string[]).map((item) => {
																const [itemName, itemId] = item.split(':');
																return (
																	<Link
																		key={item}
																		to={productsRoot.to}
																		search={{
																			filter: { category_id: itemId, status: 5 },
																			page: 1,
																		}}
																		className="cursor-pointer py-1 font-poppins text-[0.775rem] capitalize text-black hover:text-primary"
																	>
																		{itemName}
																	</Link>
																);
															})}
														</div>
													</div>
												</>
											);
										})}
									</div>
								);
							})}
						</div> */
}
