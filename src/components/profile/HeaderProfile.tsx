import { getUrlImage } from '@/lib/utils';
import { formatDate } from '@/utils/formating';
import { getLikeOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { CalendarCheck, LogOut, Mail, MapPinned, Phone } from 'lucide-react';
import AvatarComponent from '../ui/AvatarComponent';

export default function HeaderProfile({
	openDialog,
	logout,
	idUser,
	name,
	avatar_url,
	phone,
	email,
	location,
	created_at,
}: {
	openDialog: () => void;
	logout: () => void;
	name: string;
	idUser: number;
	avatar_url: string | null;
	phone: string;
	email: string;
	location: string;
	created_at: string;
}) {
	const backgroundImageStyle = {
		backgroundSize: '100% 100%',
		backgroundPosition: ' 0px 0px,0px 0px,0px 0px,0px 0px,0px 0px',
		backgroundImage:
			'repeating-linear-gradient(315deg, #00FFFF2E 92%, #073AFF00 100%),repeating-radial-gradient(75% 75% at 238% 218%, #00FFFF12 30%, #073AFF14 39%),radial-gradient(99% 99% at 109% 2%, #00C9FFFF 0%, #073AFF00 100%),radial-gradient(99% 99% at 21% 78%, #7B00FFFF 0%, #073AFF00 100%),radial-gradient(160% 154% at 711px -303px, #2000FFFF 0%, #073AFFFF 100%)',
	};
	const { data: like } = useSuspenseQuery(getLikeOptions({ id: idUser, type: 'account' }));

	return (
		<div className="">
			<div
				style={backgroundImageStyle}
				className="relative mt-20 flex h-[100px] min-w-[320px] rounded-md p-2"
			>
				{/* <div className="absolute inset-0 -z-10" /> */}
				{/* <div className="mb-3 flex flex-row items-stretch justify-center gap-3 text-white">
				<AvatarComponent name="5" url={getUrlImage(avatar_url)} style="size-[50px]" />
				<div className="flex flex-col items-baseline ">
					<div
						className={clsx(
							'mb-1 flex flex-row items-center justify-between gap-5 rounded-lg border border-transparent bg-black/50 px-2 py-1 text-white shadow-lg hover:border-primary'
						)}
					>
						<span title="Like cumulé" className="font-roboto text-xs text-white">
							{like.totalLikes || 0}
						</span>
						<div
							title="Nombre de votes"
							className="flex flex-row items-center justify-center gap-x-[1px] rounded-full bg-white/20 px-2 py-1"
						>
							<Users size={14} strokeWidth={1.8} className="text-white" />
							<span className="font-roboto text-xs text-white">{like.totalVotes || 0}</span>
						</div>
					</div>
					<span className="text-xs font-bold">{name}</span>
				</div>
			</div> */}
				{/* <div className="flex flex-col items-center justify-center gap-3 self-center">
				<div className="flex flex-row items-center justify-center gap-x-4">
					<div className="flex flex-row items-center justify-center gap-x-1">
						<PhoneCall size={17} className="text-gray-400" />
						<span className="text-xs text-gray-400">{phone}</span>
					</div>
					<div className="flex flex-row items-center justify-center gap-x-1">
						<MapPinned size={17} className="text-primary" />
						<span className="text-xs text-primary">{location}</span>
					</div>

					<div className="flex flex-row items-center justify-center gap-x-1">
						<Mail size={17} className="text-gray-400" />
						<span className="text-xs text-gray-400">{email}</span>
					</div>
				</div>
				<div className="flex flex-row items-center justify-center gap-3 self-center">
					<span className="text-xs text-slate-100">Inscrit {formatDate(created_at)}</span>
					<button
						onClick={openDialog}
						className="group flex flex-row items-center justify-center gap-x-1 rounded-2xl border-b-[1px] border-primary p-1 transition-colors hover:bg-slate-200"
					>
						<span className="text-center text-xs text-white group-hover:text-primary ">
							modifier Profile
						</span>
						<Pen size={12} className="text-white group-hover:text-primary" />
					</button>
				</div>
			</div> */}
				<button
					title="deconnexion"
					aria-label="deconnexion"
					onClick={logout}
					className="group absolute right-2 top-2 flex flex-row items-center gap-x-1 rounded-lg bg-white p-2"
				>
					<span className="hidden text-xs font-bold text-red-600 group-hover:block">Deconnexion</span>
					<LogOut size={20} className="cursor-pointer text-red-600" />
				</button>
				<div className="absolute bottom-[-72%] left-[3%] -translate-y-1/2">
					<AvatarComponent
						url={getUrlImage(avatar_url)}
						style={clsx('size-[90px] border-[5px] border-white lg:size-[75px]')}
					/>
				</div>
			</div>
			<div className="mb-5 ml-2 mt-2 flex flex-row flex-wrap items-start justify-between gap-2">
				<div className="flex flex-col gap-1">
					<div className="flex flex-row items-baseline gap-2 self-center">
						<div className={clsx('flex flex-row items-center justify-between gap-[1px]')}>
							<span title="Like cumulé" className="font-roboto text-xs">
								{like.totalLikes || 0}
							</span>
							<span className="text-sm text-black">Votants</span>
						</div>
						<div title="Nombre de votes" className="flex flex-row items-center justify-center gap-[1px]">
							<span className="font-roboto text-xs ">{like.totalVotes || 0}</span>
							<span className="text-sm text-black">Vote</span>
						</div>
					</div>
					<div className="flex items-center gap-x-1">
						<span className="text-lg font-bold text-slate-900">{name}</span>
						<div className="flex flex-row items-baseline">
							<CalendarCheck size={15} className="text-blue-600" />
							<span className="whitespace-nowrap text-xs">Inscrit {formatDate(created_at)}</span>
						</div>
					</div>
					<div className="flex flex-wrap items-baseline gap-1">
						<div className="flex flex-row items-baseline ">
							<Mail size={15} className="text-red-600" />
							<span className="text-[.85rem]  text-slate-600"> {email}</span>
						</div>
						<div className="flex flex-row items-baseline">
							<MapPinned size={15} className="text-black" />
							<span className="text-[.85rem] text-slate-600">{location}</span>
						</div>
						<div className="flex flex-row items-baseline ">
							<Phone size={15} className="text-green-600" />
							<span className="text-[.85rem] text-slate-600">{phone}</span>
						</div>
					</div>
				</div>
				<button
					onClick={openDialog}
					className="group rounded-2xl border border-black px-2 py-1 transition-colors"
				>
					<span className="text-center text-sm capitalize group-hover:text-primary lg:text-xs ">
						modifier Profile
					</span>
					{/* <Pen size={12} className=" group-hover:text-primary" /> */}
				</button>
			</div>
		</div>
	);
}
