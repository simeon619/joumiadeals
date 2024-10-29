import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { productsRoot } from '@/lib/route';
import { MenuCat } from '@/lib/utils';
import { BuildMenu } from '@/utils/mock/Menucaegorie';
import { getAllChildCategoriesOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';


export default function CategoriseMenu() {
	const { state } = useRouter();
	const { data } = useSuspenseQuery(getAllChildCategoriesOptions());

	useEffect(() => {
		if (data) {
			BuildMenu(null, MenuCat, 0, data);
		}
	}, [data]);

	const UnderlineHover =
		'absolute -bottom-1 block h-[2px] w-0 bg-primary opacity-0 transition-all duration-300 group-hover:w-2 group-hover:opacity-100 group-data-[active]:w-full group-data-[state=open]:w-full group-data-[active]:opacity-100 group-data-[state=open]:opacity-100';

	return (
		<div
			className={twMerge(
				'mt-16 flex w-full justify-center border-t-[1px] border-gray-100 border hd:hidden bg-white p-1 shadow-sm',
				'/'+productsRoot.path === state.location.pathname && 'flex',
				'/'+productsRoot.path !== state.location.pathname && 'hidden',
			)}
		>
			<NavigationMenu className="flex justify-self-center">
				<NavigationMenuList className="flex w-full justify-between pt-1 font-poppins">
					{Object.keys(MenuCat).map((categoryKey) => {
						const categoryData = MenuCat[categoryKey as keyof typeof MenuCat];
						return (
							<NavigationMenuItem key={categoryKey} className="flex w-full justify-between">
								<NavigationMenuTrigger className="relative font-poppins text-[0.775rem] capitalize text-slate-800">
									{categoryKey.split(':')[0]}
									<div className={UnderlineHover} />
								</NavigationMenuTrigger>
								<NavigationMenuContent className="flex min-w-max flex-col justify-center self-center">
									<div className="flex flex-row justify-start font-poppins">
										<div className="flex w-fit justify-center gap-x-3 bg-slate-100 px-2 py-6">
											<img
												src={categoryData['icon']}
												alt="logo"
												className="col-start-1 col-end-2 size-8 border-l-2 border-l-primary pl-2"
											/>
											<span className="block text-center text-base capitalize text-black">
												{categoryKey.split(':')[0]}
											</span>
										</div>
										<div
											className={twMerge(
												`flex flex-col flex-wrap content-start gap-x-6 gap-y-2 p-4`,
												Object.keys(categoryData).length > 5 ? 'max-h-[400px]' : 'max-h-[380px]',
												Object.keys(categoryData).length === 5 && 'max-h-[350px]'
											)}
										>
											<NavigationMenuLink asChild>
												<Link
													to={productsRoot.to}
													search={{
														filter: { category_id: categoryKey.split(':')[1], status: 5 },
														page: 1,
													}}
													className="inline-block cursor-pointer text-sm font-bold capitalize text-black hover:text-primary"
												>
													Tout {categoryKey.split(':')[0]}
												</Link>
											</NavigationMenuLink>
											{Object.keys(categoryData).map((subCategoryKey) => {
												if (subCategoryKey === 'icon') return null;
												return (
													<div key={subCategoryKey} className="max-w-[200px] p-2">
														<NavigationMenuLink asChild>
															<Link
																to={productsRoot.to}
																search={{
																	filter: { category_id: subCategoryKey.split(':')[1], status: 5 },
																	page: 1,
																}}
																className="inline-block cursor-pointer text-sm font-bold capitalize text-black hover:text-primary"
															>
																{subCategoryKey.split(':')[0]}
															</Link>
														</NavigationMenuLink>

														<span>
															{(categoryData[subCategoryKey] as string[]).map((item) => (
																<NavigationMenuLink key={item} asChild>
																	<Link
																		to={productsRoot.to}
																		search={{
																			filter: { category_id: item.split(':')[1], status: 5 },
																			page: 1,
																		}}
																		className="block cursor-pointer py-1 font-poppins text-[0.775rem] capitalize text-black hover:text-primary"
																	>
																		{item.split(':')[0]}
																	</Link>
																</NavigationMenuLink>
															))}
														</span>
													</div>
												);
											})}
										</div>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
						);
					})}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
