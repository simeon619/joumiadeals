/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Bell, Heart, MessageSquareText, Search, User } from 'lucide-react';
import Name from '../ui/Name';
import SetAdvert from '../ui/setAdvert';
import { Link, useNavigate, useRouter } from '@tanstack/react-router';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CategoriseMenu from '../ui/CategoriseMenu';
import { useAuth } from '@/services/state/User/auth';
import { redirectToConnect } from '@/lib/utils';
import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
const SIZE_ICON = 20;
const wrapIcon = 'group relative flex flex-col justify-center items-center gap-2';
const contentIcon = 'whitespace-nowrap text-xs';
const UnderlineHover =
	'absolute -bottom-1 block h-[2px] w-0 bg-blue opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-100';

export default function Header() {
	const { isAuth, InfoUser } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const refInput = useRef<HTMLInputElement>(null);

	refInput.current?.addEventListener('focus', () => {
		console.log('focus');
		setIsOpen(true);
	});

	refInput.current?.addEventListener('blur', () => {
		console.log('blur');
		setIsOpen(false);
	});
	const serachContainer = twMerge(
		'transition-all duration-300 ease-linear',
		isOpen ? 'h-[240px] scale-x-100 rounded-xl border-[1px] border-gray-200' : 'h-0 scale-x-50'
	);

	return (
		<div className="flex justify-center shadow-md">
			<div className="flex flex-col bg-white py-3">
				<div className={`relative flex items-center justify-between gap-x-3`}>
					<Name />
					<SetAdvert />
					<div className={` flex min-w-[300px] items-center rounded-xl bg-slate-100 px-2`}>
						<input
							ref={refInput}
							type="text"
							placeholder="Rechercher sur joumiadeals"
							className="w-full border-0 bg-transparent px-2 py-3 placeholder:text-slate-600  focus:outline-none"
							autoComplete="off"
							autoCapitalize="off"
							inputMode="text"
						/>
						<Search
							size={30}
							strokeWidth={2}
							absoluteStrokeWidth
							className="rounded-xl bg-blue p-1 text-white"
						/>
					</div>
					<div
						className={
							`absolute w-[500px] translate-x-[60%] top-14 z-50 bg-white  shadow-2xl` + serachContainer
						}
					></div>
					<div className=" flex justify-between gap-x-3">
						<Link className={wrapIcon}>
							<Bell size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />
							<span className={contentIcon}>Mon historique</span>
							<div className={UnderlineHover} />
						</Link>
						<Link className={wrapIcon}>
							<Heart size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />
							<span className={contentIcon}>Favoris</span>
							<div className={UnderlineHover} />
						</Link>

						<Link to="/" className={wrapIcon}>
							<MessageSquareText size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />
							<span className={contentIcon}>Messages</span>
							<div className={UnderlineHover} />
						</Link>

						{isAuth ? (
							<Link className={wrapIcon} to={'/profile'}>
								{/* <User size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth /> */}
								<div>
									<Avatar  className=" bg-blue text-blue">
										<AvatarImage
											className=""
											src={InfoUser?.send?.avatar_url}
											alt={InfoUser?.send?.name}
										/>
										<AvatarFallback>{InfoUser?.send?.name?.[0] + InfoUser?.send?.name?.[1]}</AvatarFallback>
										<span className={contentIcon}>{InfoUser?.send?.name}</span>
									</Avatar>
								</div>
										<span className={contentIcon}>{isAuth ? InfoUser.send.name : 'Se connecter'}</span>
								<div className={UnderlineHover} />
							</Link>
						) : (
							<Link className={wrapIcon} onClick={redirectToConnect}>
								<User size={SIZE_ICON} strokeWidth={2} absoluteStrokeWidth />
								<span className={contentIcon}>{'Se connecter'}</span>
								<div className={UnderlineHover} />
							</Link>
						)}
					</div>
				</div>
				<CategoriseMenu />
			</div>
		</div>
	);
}
