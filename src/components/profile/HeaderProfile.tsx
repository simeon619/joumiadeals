import AvatarComponent from '../ui/AvatarComponent';
import { LogOut, Mail, MapPinned, Pen, PhoneCall, Sliders } from 'lucide-react';

export default function HeaderProfile({
	openDialog,
	logout,
	name,
	avatar_url,
	phone,
	email,
	location,
}: {
	openDialog: () => void;
	logout: () => void;
	name: string;
	avatar_url: string | null;
	phone: string;
	email: string;
	location: string;
}) {
	return (
		<div className="relative mt-4 flex flex-col items-center justify-center gap-y-5 rounded-sm border-2 border-gray-100 bg-slate-50 p-2">
			<div className="flex flex-col items-center gap-y-1">
				<AvatarComponent name={name} url={avatar_url || ''} style="size-15" />

				<div className="flex flex-row items-center justify-center gap-x-1">
					<span className="text-base">{name}</span>
					<button
						onClick={openDialog}
						className="group flex flex-row items-center justify-center gap-x-1 rounded-2xl border-b-[1px] border-primary p-1 transition-colors hover:bg-slate-200"
					>
						<span className="text-center text-xs text-black group-hover:text-primary ">Edit Profile</span>
						<Pen size={12} className="text-black group-hover:text-primary" />
					</button>
				</div>
			</div>
			<div className="flex flex-row gap-x-6">
				<div className="flex flex-row items-center justify-center gap-x-1">
					<Mail size={20} className="text-slate-700" />
					<span className="text-sm">{email}</span>
				</div>
				<div className="flex flex-row items-center justify-center gap-x-1">
					<MapPinned size={20} className="text-slate-700" />
					<span className="text-sm">{location}</span>
				</div>
				<div className="flex flex-row items-center justify-center gap-x-1">
					<PhoneCall size={20} className="text-slate-700" />
					<span className="text-sm">{phone} </span>
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
			<button
				aria-label="parametre"
				onClick={() => {}}
				className="absolute left-2 top-2 flex flex-row items-center gap-x-1"
			>
				<Sliders className="cursor-pointer text-gray-900" />
				<span className="text-sm text-gray-900">Parametre</span>
			</button>
		</div>
	);
}
