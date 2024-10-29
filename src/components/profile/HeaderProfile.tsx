import { getUrlImage } from '@/lib/utils';
import { formatDate } from '@/utils/formating';
import { getLikeOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { CalendarCheck, LogOut, MapPinned, Phone } from 'lucide-react';
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
			<div className="mb-5 ml-2 mt-8 flex flex-row flex-wrap items-start justify-between gap-2">
				<div className="flex flex-col gap-1">
					<div className="flex flex-row items-baseline gap-x-1">
						<span className="text-lg font-bold text-slate-900">{name}</span>
						<div className="flex flex-row items-baseline gap-2 self-center text-gray-500">
							<div className={clsx('flex flex-row items-baseline justify-between gap-[1px]')}>
								<span title="Like cumulé" className="font-roboto text-xs">
									{like.totalLikes || 0}
								</span>
								<span className="text-xs text-gray-500">Votants</span>
							</div>
							<div
								title="Nombre de votes"
								className="flex flex-row items-baseline justify-center gap-[1px]"
							>
								<span className="font-roboto text-xs ">{like.totalVotes || 0}</span>
								<span className="text-xs text-gray-500">Vote</span>
							</div>
						</div>
					</div>
					<div className="flex flex-row items-baseline">
						<CalendarCheck size={15} className="text-blue-600" />
						<span className="whitespace-nowrap text-xs text-gray-500">Inscrit {formatDate(created_at)}</span>
					</div>
					<div className="flex flex-wrap items-baseline gap-1">
						<div className="flex flex-row items-baseline">
							<MapPinned size={15} className="text-black" />
							<span className="text-[.85rem] text-slate-500">{location}</span>
						</div>
						<div className="flex flex-row items-baseline ">
							<Phone size={15} className="text-green-600" />
							<span className="text-[.85rem] text-slate-500">{phone}</span>
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
