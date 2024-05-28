import { MapPinned, Menu, PhoneCall } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { profileRoot } from '@/lib/route';
import { accountQueryOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import WrapProduct from '@/components/product/WrapProduct';
import LayoutProduct2 from '@/components/product/LayoutProduct2';
import { formatDate } from '@/utils/formating';
export default function ProfilePage() {
	const { provider_id } = profileRoot.useSearch();
	const { data: account } = useSuspenseQuery(accountQueryOptions(provider_id));
	return (
		<div className="flex w-full flex-col justify-center">
			<div
				style={{
					backgroundImage: `url(${account?.avatar_url})`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					// backdropFilter: 'blur(8px)',
					// filter: blur(8px),
				}}
				className="relative mt-4 flex flex-col items-center justify-center gap-y-1 overflow-hidden rounded-md  p-2 backdrop-blur-2xl"
			>
				<div className="absolute inset-0 -z-10 backdrop-blur-xl backdrop-brightness-50" />
				<div className="mb-3 flex flex-col items-center gap-y-1 text-white ">
					{/* <AvatarComponent name={account.name} url={account.avatar_url || ''} style="w-[150px] h-24" /> */}
					<div className="flex  items-baseline gap-2">
						<span className="text-xl font-bold">Visiter les produits poster par </span>
						<span className="text-xs font-bold">{account?.name}</span>
					</div>
					<span className={`text-xs text-gray-400`}>Membre depuis {formatDate(account.created_at)}</span>
				</div>
				<div className="flex flex-row items-center justify-center gap-x-6">
					<div className="flex flex-row items-center justify-center gap-x-1">
						<MapPinned size={20} className="text-primary" />
						<span className="text-sm text-primary">{account?.location}</span>
					</div>
					{/* <div className="flex flex-row items-center justify-center gap-x-1">
						<PhoneCall size={20} className="text-red-700" />
						<span className="text-sm">{account?.phone} </span>
					</div> */}
				</div>

				<Popover>
					<PopoverTrigger asChild>
						<Menu className={'absolute right-2 top-2 cursor-pointer text-gray-900'} />
					</PopoverTrigger>
					<PopoverContent className="w-[150px]">
						<div className="grid gap-4">
							<div className="grid gap-2">
								<h1>Signalez </h1>
								<h1>Partager</h1>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>

			<WrapProduct LayoutProduct={LayoutProduct2} componentRoot={profileRoot} />
		</div>
	);
}
