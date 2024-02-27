/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Bell, Heart, Mail, MessageSquareText, Search, User } from 'lucide-react';
import Name from '../ui/Name';
import SetAdvert from '../ui/setAdvert';
import { Link } from '@tanstack/react-router';
import CategoriseMenu from '../ui/CategoriseMenu';
import { useAuth } from '@/services/state/User/auth';
import { redirectToConnect } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import AvatarComponent from '../ui/AvatarComponent';
import FilterProduct from '../product/FilterProduct';
const SIZE_ICON = 20;
const wrapIcon = 'group relative flex flex-col justify-center items-center gap-2';
const contentIcon = 'whitespace-nowrap text-xs';
const UnderlineHover =
	'absolute -bottom-1 block h-[2px] w-0 bg-primary opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-100';

export default function Header() {
	const { isAuth, InfoUser } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const refInput = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const toggleSearchBar = () => {
			setIsOpen((prev) => !prev);
		};

		const inputRef = refInput.current;

		inputRef?.addEventListener('focus', toggleSearchBar);
		inputRef?.addEventListener('blur', toggleSearchBar);

		return () => {
			inputRef?.removeEventListener('focus', toggleSearchBar);
			inputRef?.removeEventListener('blur', toggleSearchBar);
		};
	}, []);

	const [isShadow, setIsShadow] = useState(false);

	useEffect(() => {
		window.onscroll = (e) => {
			const scrollY = window.scrollY;
			if (scrollY > 10) {
				setIsShadow(true);
			} else {
				setIsShadow(false);
			}
		};
	}, []);
	const serachContainer = twMerge(
		'transition-all duration-300 ease-linear',
		isOpen ? 'h-[240px] scale-x-100 rounded-xl border-[1px] border-gray-200' : 'h-0 scale-x-50'
	);

	return (
		<div
			className={twMerge(
				'sticky top-0 z-50 flex w-full justify-center flex-col items-center duration-300 bg-white',
				isShadow && 'shadow-md'
			)}
		>
			<div className="flex flex-col bg-white py-2">
				<div className={`relative flex items-center justify-between gap-x-3`}>
					<Name />
					<SetAdvert />
					<div className={`flex min-w-[270px] items-center rounded-xl bg-slate-100 px-2`}>
						<input
							ref={refInput}
							type="text"
							placeholder="Rechercher sur joumiadeals"
							className="w-full border-0 bg-transparent text-base p-2 placeholder:text-slate-600 focus:outline-none"
							autoComplete="off"
							autoCapitalize="off"
							inputMode="text"
						/>
						<Search
							size={30}
							strokeWidth={2}
							absoluteStrokeWidth
							className="rounded-xl bg-primary p-1 text-white"
						/>
					</div>
					<div
						className={
							`absolute w-[500px] translate-x-[60%] top-14 z-50 bg-white  shadow-2xl` + serachContainer
						}
					></div>
					<div className=" flex justify-between gap-x-3">
						<button className={wrapIcon}>
							<Bell size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />
							<span className={contentIcon}>Mon historique</span>
							<div className={UnderlineHover} />
						</button>
						<Link to="/myprofile/favourite" search={{ page: 1 }} className={wrapIcon}>
							<Heart size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />
							<span className={contentIcon}>Favoris</span>
							<div className={UnderlineHover} />
						</Link>

						<Link to="/" className={wrapIcon}>
							<Mail size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />
							<span className={contentIcon}>Messages</span>
							<div className={UnderlineHover} />
						</Link>
						{isAuth ? (
							<Link className={wrapIcon} to={'/myprofile'} search={{ provider_id: InfoUser.id }}>
								<AvatarComponent name={InfoUser.name} url={InfoUser.avatar_url || ''} />
								<div className={UnderlineHover} />
							</Link>
						) : (
							<button className={wrapIcon} onClick={redirectToConnect}>
								<User size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />
								<span className={contentIcon}>{'Se connecter'}</span>
								<div className={UnderlineHover} />
							</button>
						)}
					</div>
				</div>
			</div>
			{/* <FilterProduct /> */}
		</div>
	);
}
