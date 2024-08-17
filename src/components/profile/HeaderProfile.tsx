import { formatDate } from '@/utils/formating';
import { getLikeOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { LogOut, Mail, MapPinned, Pen, PhoneCall, Users } from 'lucide-react';
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
		backgroundImage: `url(${avatar_url})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	};
	const { data: like } = useSuspenseQuery(getLikeOptions({ id: idUser, type: 'account' }));

	return (
		// <div className="relative mt-4 flex flex-col items-center justify-center gap-y-5 rounded-sm border-2 border-gray-100 bg-slate-50 p-2">
		// 	<div className="flex flex-col items-center gap-y-1">
		// 		<AvatarComponent name={name} url={avatar_url || ''} style="size-15" />
		// 		<div className="flex flex-row items-center justify-center gap-x-1">
		// 			<span className="text-base">{name}</span>
		// 			<button
		// 				onClick={openDialog}
		// 				className="group flex flex-row items-center justify-center gap-x-1 rounded-2xl border-b-[1px] border-primary p-1 transition-colors hover:bg-slate-200"
		// 			>
		// 				<span className="text-center text-xs text-black group-hover:text-primary ">Edit Profile</span>
		// 				<Pen size={12} className="text-black group-hover:text-primary" />
		// 			</button>
		// 		</div>
		// 	</div>
		// 	<div className="flex flex-row gap-x-6">
		// 		<div className="flex flex-row items-center justify-center gap-x-1">
		// 			<Mail size={20} className="text-slate-700" />
		// 			<span className="text-sm">{email}</span>
		// 		</div>
		// 		<div className="flex flex-row items-center justify-center gap-x-1">
		// 			<MapPinned size={20} className="text-slate-700" />
		// 			<span className="text-sm">{location}</span>
		// 		</div>
		// 		<div className="flex flex-row items-center justify-center gap-x-1">
		// 			<PhoneCall size={20} className="text-slate-700" />
		// 			<span className="text-sm">{phone} </span>
		// 		</div>
		// 	</div>
		// 	<button
		// 		aria-label="deconnexion"
		// 		onClick={logout}
		// 		className="absolute right-2 top-2 flex flex-row items-center gap-x-1"
		// 	>
		// 		<span className="text-sm text-red-600">Deconnexion</span>
		// 		<LogOut className="cursor-pointer text-red-600" />
		// 	</button>
		// 	<button
		// 		aria-label="parametre"
		// 		onClick={() => {}}
		// 		className="absolute left-2 top-2 flex flex-row items-center gap-x-1"
		// 	>
		// 		<Sliders className="cursor-pointer text-gray-900" />
		// 		<span className="text-sm text-gray-900">Parametre</span>
		// 	</button>
		// </div>
		<div
			style={backgroundImageStyle}
			className="relative mt-4 flex items-start justify-start gap-14 overflow-hidden rounded-md p-2 backdrop-blur-2xl"
		>
			<div className="absolute inset-0 -z-10 backdrop-blur-xl backdrop-brightness-50" />
			<div className="mb-3 flex flex-row items-stretch justify-center gap-3 text-white">
				<AvatarComponent name="5" url={avatar_url || ''} style="size-[50px]" />
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
			</div>
			<div className="flex flex-col items-center justify-center gap-3 self-center">
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
			</div>
			<button
				aria-label="deconnexion"
				onClick={logout}
				className="absolute right-2 top-2 flex flex-row items-center gap-x-1"
			>
				<span className="text-sm text-red-600">Deconnexion</span>
				<LogOut className="cursor-pointer text-red-600" />
			</button>
		</div>
	);
}
