import { MenuCat } from '@/utils/mock/Menucaegorie';
import {
	Baby,
	Bike,
	Briefcase,
	CarFront,
	Home,
	Layers3,
	Shirt,
	Smartphone,
	Sofa,
} from 'lucide-react';
const SIZE_ICON = 20;
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { twMerge } from 'tailwind-merge';
import { useRouter } from '@tanstack/react-router';

// const MenuCat = await getMenu()
export default function CategoriseMenu() {
	const { state } = useRouter();

	// state.location === ""

	const iconKeys = {
		immobilier: <Home size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />,
		vehicules: <CarFront size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />,
		motos: <Bike size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />,
		emploi: <Briefcase size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />,
		mode: <Shirt size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />,
		'maisons & jardin': <Sofa size={32} strokeWidth={2} absoluteStrokeWidth />,
		famille: <Baby size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />,
		electronique: <Smartphone size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />,
		Loisirs: <Bike size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />,
		Autres: <Layers3 size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />,
	};
	const UnderlineHover =
		'absolute -bottom-1 block h-[2px] w-0 bg-blue opacity-0 transition-all duration-300 group-hover:w-2 group-hover:opacity-100 group-data-[active]:w-full group-data-[state=open]:w-full group-data-[active]:opacity-100 group-data-[state=open]:opacity-100';

	return (
		<>
			<NavigationMenu
				className={twMerge(`w-full`, state.location.pathname.includes('/myprofile') ? 'hidden' : '')}
			>
				<NavigationMenuList className="gap-x-3 py-1 font-poppins">
					{Object.keys(MenuCat).map((Categorie, i) => {
						const value = Categorie as keyof typeof MenuCat;
						const data = MenuCat[value];
						return (
							<NavigationMenuItem key={i} value={Categorie}>
								<NavigationMenuTrigger className="relative font-light capitalize text-slate-800">
									{Categorie}
									<div className={UnderlineHover} />
								</NavigationMenuTrigger>
								<NavigationMenuContent className={'w-[1030px]'}>
									<div className="flex flex-row justify-start font-poppins">
										<div className="flex w-1/6 justify-center gap-x-3 bg-slate-100 p-6">
											{iconKeys[value]}
											<span className="block text-center text-base capitalize text-black">{Categorie}</span>
										</div>
										<div
											className={twMerge(
												`flex  flex-col flex-wrap content-start gap-x-6 gap-y-2 p-4`,
												Object.keys(data).length > 4 ? 'max-h-[500px]' : 'max-h-[300px]'
											)}
										>
											{Object.keys(data).map((Categorie) => (
												<div key={Categorie} className="max-w-[200px] p-2">
													<span className="inline-block cursor-pointer text-sm font-bold capitalize text-black hover:text-blue">
														{Categorie}
													</span>
													<span>
														{data[Categorie].map((item) => (
															<span
																key={item}
																className="block cursor-pointer text-wrap py-1 text-sm  capitalize text-slate-500 hover:text-blue"
															>
																{item}
															</span>
														))}
													</span>
												</div>
											))}
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
