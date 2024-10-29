/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { productDetailsRoot, productsRoot } from '@/lib/route';
import { getUrlImage, handleConnect } from '@/lib/utils';
import { useAuth } from '@/services/state/User/auth';
import { filterCategory } from '@/utils/helpers';
import { get_second_cat } from '@/utils/mock/Menucaegorie';
import { getAllChildCategoriesOptions, getAllfeaturesOptions } from '@/utils/queryOptions';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { AlignJustify, Bell, Heart, Mail, Search, User2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'react-use';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import AvatarComponent from '../ui/AvatarComponent';
import Name from '../ui/Name';
import SetAdvert from '../ui/setAdvert';
import PopPupMenu from './menu/PopPupMenu';
const SearchSchema = z.object({
	search: z.string(),
});
type SearchSchemaType = z.infer<typeof SearchSchema>;
const SIZE_ICON = 18;
const wrapIcon = 'group relative flex flex-col justify-center items-center gap-1';
const contentIcon = 'whitespace-nowrap text-[.85rem]';
const UnderlineHover =
	'absolute -bottom-1 block h-[2px] w-0 bg-primary opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-100';
const ElementShowSerach = 6;

export default function Header() {
	const { isAuth, InfoUser } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const { data } = useSuspenseQuery(getAllChildCategoriesOptions());
	const { data: features } = useSuspenseQuery(getAllfeaturesOptions());
	const state = useRouterState();
	const [searchterms, setSearchterms] = useState<Record<string, string>>({});
	const navigate = useNavigate({ from: productsRoot.fullPath });
	const { watch, register } = useForm<SearchSchemaType>({
		resolver: zodResolver(SearchSchema),
	});

	const searchTerm = watch('search');
	const [currentTab, setCurrentTab] = useState(0);
	useDebounce(
		() => {
			if (searchTerm) {
				const filtered = filterCategory(searchTerm, data, features);
				setIsOpen(true);
				setCurrentTab(0);
				if (filtered.length !== 0) {
					setSearchterms({});
					filtered.forEach((item) => {
						const searchT = get_second_cat(item.id, data);
						if (searchT) {
							setSearchterms((prev) => ({
								...prev,
								[searchT.id]: searchT.label,
							}));
						}
					});
				}
			} else {
				setSearchterms({});
			}
		},
		205,
		[searchTerm]
	);
	const serachContainer = twMerge(
		'transition-all duration-100 ease-linear',
		isOpen && searchTerm
			? ' rounded-xl border-[1px] border-gray-200'
			: 'scale-0 border-0 opacity-0 pointer-events-none'
	);
	function goSearchCategory(event: any, id: string) {
		navigate({
			to: productsRoot.to,
			search: { filter: { category_id: id, text: searchTerm, status: 5 }, page: 1 },
		});
		event.preventDefault();
		handleBlurSearch();
	}
	const handleBlurSearch = () => {
		const timeOut = setTimeout(() => {
			setIsOpen(false);
		}, 350);
		return () => {
			clearTimeout(timeOut);
		};
	};

	useEffect(() => {
		const handleKeyDown = (e: { keyCode: any }) => {
			const keyCode = e.keyCode;
			if (keyCode == 13 && isOpen) {
				if (currentTab == 0) {
					return goSearchCategory(e, 'all');
				}
				const id = Object.keys(searchterms)[currentTab - 1];
				return goSearchCategory(e, id);
			}
			if (keyCode == 38 && currentTab >= 1 && isOpen) setCurrentTab(currentTab - 1);
			if (
				keyCode == 40 &&
				currentTab <= Math.min(Object.keys(searchterms).length, ElementShowSerach) - 1 &&
				isOpen
			)
				setCurrentTab(currentTab + 1);
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [searchterms, currentTab]);

	const [showMenu, setShowMenu] = useState(false);
	const handleClose = () => {
		setShowMenu(false);
		document.body.style.overflow = 'auto';
	};
	const handleOpen = () => {
		setShowMenu(true);
		document.body.style.overflow = 'hidden';
	};
	return (
		<>
			<div
				className={twMerge(
					' top-0 z-50 inset-x-0 flex justify-center flex-col min-w-full items-center bg-white',
					'/'+productsRoot.path === state.location.pathname && 'fixed',
					'/'+productsRoot.path !== state.location.pathname && 'absolute',
					productDetailsRoot.path.split('/')[0] === state.location.pathname.split('/')[1] && 'md:hidden',
					// isShadow && 'shadow-lg'
				)}
			>
				<div className={`relative flex w-full items-center justify-center gap-x-3 py-2 hd:px-3`}>
					<div className="flex items-center gap-x-2 hd:hidden">
						<Name />
						<SetAdvert />
					</div>
					<button onClick={handleOpen} className="hidden hd:block">
						<AlignJustify size={33} className="text-gray-600" />
					</button>
					<div
						className={`relative flex w-[270px] items-center rounded-xl bg-slate-100 px-2 hd:w-[800px]`}
					>
						<input
							{...register('search')}
							name={'search'}
							onFocus={() => {
								setIsOpen(true);
							}}
							onBlur={handleBlurSearch}
							type="text"
							placeholder="Rechercher sur Amedeals"
							className="w-full border-0 bg-transparent p-2 py-[.72] text-[.9rem] placeholder:text-slate-700 focus:outline-none"
							autoComplete="off"
							autoCapitalize="off"
							inputMode="text"
						/>
						<Search
							size={30}
							onClick={(event) => goSearchCategory(event, 'all')}
							strokeWidth={2}
							absoluteStrokeWidth
							className="cursor-pointer rounded-xl bg-primary p-1 text-white"
						/>
						<div
							className={
								`flex flex-col items-start py-3 absolute w-[100%] gap-y-2 left-0 top-12 z-70 bg-white shadow-2xl` +
								serachContainer
							}
						>
							{Boolean(searchTerm) && (
								<button
									className={twMerge(
										'ml-6 flex w-[90%] items-center gap-x-1 rounded-md py-1 text-[.825rem] hover:bg-slate-300',
										currentTab == 0 && 'bg-slate-300'
									)}
									onClick={(event) => goSearchCategory(event, 'all')}
								>
									<Search
										size={25}
										strokeWidth={2}
										absoluteStrokeWidth
										className="min-h-[25px] min-w-[25px] rounded-xl bg-gray-300 p-1 text-black"
									/>
									<span className="truncate">{searchTerm}</span> <span className="text-slate-500">dans</span>
									<span className="whitespace-nowrap text-primary">Toute la Côte d&apos;Ivoire</span>
								</button>
							)}
							{Object.keys(searchterms)
								.slice(0, ElementShowSerach)
								.map((id, index) => {
									return (
										<button
											className={twMerge(
												'ml-6 flex w-[90%] items-center gap-x-1  rounded-md py-1 text-[.825rem] hover:bg-slate-300',
												currentTab == index + 1 && 'bg-slate-300'
											)}
											key={id}
											onClick={(event) => goSearchCategory(event, id)}
										>
											<Search
												size={25}
												strokeWidth={2}
												absoluteStrokeWidth
												className="min-h-[25px] min-w-[25px] rounded-xl bg-gray-300 p-1 text-black"
											/>
											<span className="truncate">{searchTerm}</span>
											<span className="text-slate-500">dans</span>
											<span className="whitespace-nowrap text-primary">{searchterms[id]}</span>
										</button>
									);
								})}
						</div>
					</div>
					<div className="flex justify-between gap-x-5 hd:hidden">
						{isAuth && (
							<>
								<Link to="/myprofile/historique" search={{ page: 1 }} className={wrapIcon}>
									<Bell size={SIZE_ICON} strokeWidth={1.5} absoluteStrokeWidth />
									<span className={contentIcon}>Mon historique</span>
									<div className={UnderlineHover} />
								</Link>
								<Link to="/myprofile/favourite" search={{ page: 1 }} className={wrapIcon}>
									<Heart size={SIZE_ICON} strokeWidth={1.5} absoluteStrokeWidth />
									<span className={contentIcon}>Favoris</span>
									<div className={UnderlineHover} />
								</Link>

								<Link to="/discussion" search={{ filter: { type: 'private' } }} className={wrapIcon}>
									<Mail size={SIZE_ICON} strokeWidth={1.5} absoluteStrokeWidth />
									<span className={contentIcon}>Messages</span>
									<div className={UnderlineHover} />
								</Link>
							</>
						)}
						{isAuth ? (
							<Link
								className={wrapIcon}
								to={'/myprofile/annonces'}
								search={{ provider_id: InfoUser.id, filter: { status: 5 } }}
							>
								<AvatarComponent name={InfoUser.name} url={getUrlImage(InfoUser?.avatar_url)} />
								<div className={UnderlineHover} />
							</Link>
						) : (
							<button className={wrapIcon} onClick={handleConnect}>
								<User2Icon size={SIZE_ICON} strokeWidth={1.5} absoluteStrokeWidth />
								<span className={contentIcon}>{'Se connecter'}</span>
								<div className={UnderlineHover} />
							</button>
						)}
					</div>
				</div>
			</div>
			<PopPupMenu setClosePopup={handleClose} showMenu={showMenu} />
		</>
	);
}

// node ace make:model moderateurProduct -m
