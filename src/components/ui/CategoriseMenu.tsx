// import { MenuCat } from '@/utils/mock/Menucaegorie';

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { twMerge } from 'tailwind-merge';
import { useRouter } from '@tanstack/react-router';
import {  useMemo } from 'react';
import { BuildMenu } from '@/utils/mock/Menucaegorie';
import { getAllChildCategoriesOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
const MenuCat = {};
export default function CategoriseMenu() {
	const { state } = useRouter();
	// const myRef = useRef<HTMLElement>(null);
	// const [isOpen, setIsOpen] = useState(false);

	const { data } = useSuspenseQuery(getAllChildCategoriesOptions());
	useMemo(() => {
		BuildMenu(null, MenuCat, 0, data);
	}, []);

	const UnderlineHover =
		'absolute -bottom-1 block h-[2px] w-0 bg-primary opacity-0 transition-all duration-300 group-hover:w-2 group-hover:opacity-100 group-data-[active]:w-full group-data-[state=open]:w-full group-data-[active]:opacity-100 group-data-[state=open]:opacity-100';

	return (
		<>
			<NavigationMenu
				className={twMerge(
					`w-app flex self-center`,
					state.location.pathname.includes('/myprofile') ? 'hidden' : ''
				)}
			>
				<NavigationMenuList className="gap-x-3 py-1 font-poppins">
					{Object.keys(MenuCat).map((Categorie, i) => {
						const value = Categorie as keyof typeof MenuCat;
						const data = MenuCat[value];
						return (
							<NavigationMenuItem key={i} value={Categorie}>
								<NavigationMenuTrigger className="relative font-light capitalize text-slate-800">
									{Categorie.split(':')[0]}
									<div className={UnderlineHover} />
								</NavigationMenuTrigger>
								<NavigationMenuContent className={'w-[1030px]'}>
									<div className="flex flex-row justify-start font-poppins">
										<div className="flex w-1/6  justify-center gap-x-3  bg-slate-100 p-6">
											<img
												src={data['icon']}
												alt="logo"
												className="col-start-1 col-end-2 size-8 border-l-2 border-l-primary pl-2"
											/>
											<span className="block text-center text-base capitalize text-black">{Categorie.split(':')[0]}</span>
										</div>
										<div
											className={twMerge(
												`flex flex-col flex-wrap content-start gap-x-6 gap-y-2 p-4`,
												Object.keys(data).length > 5 ? 'max-h-[400px]' : 'max-h-[380px]',
												Object.keys(data).length === 5 && 'max-h-[350px]'
											)}
										>
											{Object.keys(data).map((Categorie) => {
												if (Categorie === 'icon') return null;
												return (
													<div key={Categorie} className="max-w-[200px] p-2">
														<span className="inline-block cursor-pointer text-sm font-bold capitalize text-black hover:text-primary">
															{Categorie.split(':')[0]}
														</span>
														<span>
															{data[Categorie].map((item) => (
																<span
																	key={item}
																	className="block cursor-pointer text-wrap py-1 text-sm  capitalize text-slate-500 hover:text-primary"
																>
																	{item.split(':')[0]}
																</span>
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
		</>
	);
}
