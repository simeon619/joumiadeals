/* eslint-disable @typescript-eslint/no-explicit-any */
import AvatarComponent from '@/components/ui/AvatarComponent';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { noticesAccountRoot, productsOtherRoot } from '@/lib/route';
import { getUrlImage } from '@/lib/utils';
import { formatDate } from '@/utils/formating';
import { accountQueryOptions, getLikeOptions, useToggleLikeMutation } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, Outlet, useSearch } from '@tanstack/react-router';
import clsx from 'clsx';
import { MapPinned, Menu, PhoneCall, ThumbsDown, ThumbsUp, Users } from 'lucide-react';
export default function ProfilePage() {
	const { provider_id } = useSearch({ from: '/otherProfile/o_profile' }) as {
		provider_id: number;
	};

	const { data: account } = useSuspenseQuery(accountQueryOptions(provider_id));
	const { data: like } = useSuspenseQuery(getLikeOptions({ id: provider_id, type: 'account' }));
	const { mutate: toggleLike } = useToggleLikeMutation();
	const backgroundImageStyle = {
		backgroundImage: `url(${getUrlImage(account?.avatar_url)})`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	};

	const handleLike = (value: -1 | 1) => {
		toggleLike({ id: provider_id, type: 'account', value });
	};
	return (
		<div className="flex w-full flex-col justify-center">
			<div
				style={backgroundImageStyle}
				className="relative mt-16 flex items-start justify-start gap-14 overflow-hidden rounded-md border p-2 backdrop-blur-2xl"
			>
				<div className="absolute inset-0 -z-10 backdrop-blur-xl backdrop-brightness-50" />
				<div className="mb-3 flex flex-row items-stretch justify-center gap-3 text-white">
					<AvatarComponent name="5" url={getUrlImage(account.avatar_url)} style="size-[50px]" />
					<div className="flex flex-row items-baseline gap-2">
						<div className="flex flex-col gap-1">
							<span className="text-xs font-bold">{account?.name}</span>
							<div
								className={clsx(
									'flex flex-row items-center justify-between gap-5 rounded-lg border-2 bg-black/50 px-2 py-1 text-white shadow-lg',
									{
										'border-blue-400/40': like.mylike === 1,
										'border-red-400/40': like.mylike === -1,
										'border-gray-600/40': like.mylike === 0,
									}
								)}
							>
								<ThumbsUp
									size={18}
									strokeWidth={1.8}
									className={clsx('cursor-pointer hover:text-blue-400', {
										'text-blue-900': like.mylike === 1,
									})}
									onClick={() => handleLike(1)}
								/>
								<span className="font-roboto text-xs text-white">{like.totalLikes || 0}</span>
								<ThumbsDown
									size={18}
									strokeWidth={1.8}
									className={clsx('cursor-pointer hover:text-red-400', {
										'text-red-900': like.mylike === -1,
									})}
									onClick={() => handleLike(-1)}
								/>
								<div className="flex flex-row items-center justify-center gap-x-[1px] rounded-full bg-primary/20 px-2 py-1">
									<Users size={14} strokeWidth={1.8} className="text-primary" />
									<span className="font-roboto text-xs text-primary">{like.totalVotes || 0}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center gap-3 self-center">
					<div className="flex flex-row items-center justify-center gap-x-4">
						<div className="flex flex-row items-center justify-center gap-x-1">
							<MapPinned size={20} className="text-primary" />
							<span className="text-sm text-primary">{account?.location}</span>
						</div>
						<div className="flex flex-row items-center justify-center gap-x-1">
							<PhoneCall size={20} className="text-slate-100" />
							<span className="text-sm text-slate-100">{account?.phone}</span>
						</div>
					</div>
					<span className="text-xs text-gray-400">Inscrit {formatDate(account.created_at)}</span>
				</div>
				<Popover>
					<PopoverTrigger asChild>
						<Menu className="absolute right-2 top-2 cursor-pointer text-gray-100" />
					</PopoverTrigger>
					<PopoverContent className="w-[150px]">
						<div className="grid gap-4">
							<div className="grid gap-2">
								<h1>Signalez</h1>
								<h1>Partager</h1>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<div className="my-2 inline-flex gap-x-5 self-start rounded-lg border bg-slate-100 p-1">
				{(
					[
						[productsOtherRoot.to, 'les produits', false, account?.id],
						[noticesAccountRoot.to, 'Avis et commentaires', true, account?.id],
					] as const
				).map(([to, label, exact, provider_id]) => {
					return (
						<Link
							key={to}
							to={to}
							activeOptions={{ includeSearch: false }}
							activeProps={{
								className: 'text-black bg-white border shadow-md rounded-lg',
							}}
							className={'px-1 py-2 text-sm'}
							search={(old: any) => {
								return exact
									? {
											provider_id: old?.provider_id ?? provider_id,
											filter: {
												order_by: old?.filter?.order_by ?? 'date_desc',
												text: old?.filter?.text ?? '',
												type: old?.filter?.type ?? 'product',
											},
											page: old?.page ?? 1,
										}
									: {
											provider_id: old?.provider_id ?? provider_id,
											filter: { status: 5 as const },
											page: old?.page ?? 1,
										};
							}}
						>
							{label}
						</Link>
					);
				})}
			</div>

			<hr />
			<Outlet />
		</div>
	);
}
