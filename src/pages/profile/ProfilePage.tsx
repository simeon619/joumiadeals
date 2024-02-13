import { MapPinned, Menu, PhoneCall } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { profileRoot } from '@/lib/route';
import { accountQueryOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import AvatarComponent from '@/components/ui/AvatarComponent';
export default function ProfilePage() {
	const { profileId } = profileRoot.useParams();
	const { data: account } = useSuspenseQuery(accountQueryOptions(profileId));
	return (
		<>
			<div className="relative mt-4 flex flex-col items-center justify-center gap-y-5 rounded-sm border-2 border-gray-100 bg-slate-50 p-2">
				<div className="mb-3 flex flex-col items-center gap-y-1 ">
					<AvatarComponent name={account.name} url={account.avatar_url || ''} style="size-15" />
				</div>
				<div className="flex flex-row items-center justify-center gap-x-6">
					<div className="flex flex-row items-center justify-center gap-x-1">
						<MapPinned size={20} className="text-blue" />
						<span className="text-sm">{account?.location}</span>
					</div>
					<div className="flex flex-row items-center justify-center gap-x-1">
						<PhoneCall size={20} className="text-red-700" />
						<span className="text-sm">{account?.phone} </span>
					</div>
				</div>
				<Popover>
					<PopoverTrigger asChild>
						<Menu className={'absolute right-2 top-2 cursor-pointer text-gray-900'} />
					</PopoverTrigger>
					<PopoverContent className="w-80">
						<div className="grid gap-4">
							<div className="grid gap-2">
								<h1>Signalez </h1>
								<h1>Partager</h1>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
		</>
	);
}
