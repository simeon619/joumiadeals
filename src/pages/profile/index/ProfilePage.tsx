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
		backgroundSize: '100% 100%',
		backgroundPosition: '0px 0px, 0px 0px, 0px 0px, 0px 0px, 0px 0px',
		backgroundImage: `
		  repeating-linear-gradient(315deg, #FF00FF2E 92%, #FFA50000 100%),
		  repeating-radial-gradient(75% 75% at 238% 218%, #FF00FF12 30%, #FFA50014 39%),
		  radial-gradient(99% 99% at 109% 2%, #FF69B4FF 0%, #FFA50000 100%),
		  radial-gradient(99% 99% at 21% 78%, #FF1493FF 0%, #FFA50000 100%),
		  radial-gradient(160% 154% at 711px -303px, #8A2BE2FF 0%, #FF4500FF 100%)
		`,
	};

	const handleLike = (value: -1 | 1) => {
		toggleLike({ id: provider_id, type: 'account', value });
	};
	return (
		<div className="flex w-full flex-col justify-center px-6">
			<div
				style={backgroundImageStyle}
				className="relative mb-[10px] mt-16  flex h-[80px] items-start justify-start gap-14 rounded-md border p-2"
			>
				{/* <div className="absolute inset-0 -z-10" /> */}
				<AvatarComponent
					name="5"
					url={getUrlImage(account.avatar_url)}
					style="size-[50px] absolute bottom-[5px]"
				/>
				<div
					className={clsx(
						' absolute bottom-1 right-1 flex flex-row items-center justify-between gap-3 rounded-md border bg-slate-800/50  px-2 py-1 text-white shadow-md transition-all duration-300 hover:shadow-xl',
						{
							'border-blue-500': like.mylike === 1,
							'border-red-500': like.mylike === -1,
							'border-gray-600': like.mylike === 0,
						}
					)}
				>
					<ThumbsUp
						size={20}
						strokeWidth={2}
						className={clsx(
							'cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-blue-500',
							{
								'text-blue-600': like.mylike === 1,
							}
						)}
						onClick={() => handleLike(1)}
					/>
					<span className="font-roboto text-sm font-semibold text-gray-200">{like.totalLikes || 0}</span>
					<ThumbsDown
						size={20}
						strokeWidth={2}
						className={clsx(
							'cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-red-500',
							{
								'text-red-600': like.mylike === -1,
							}
						)}
						onClick={() => handleLike(-1)}
					/>
					<div className="flex flex-row items-center justify-center gap-2 rounded-full bg-primary/10 px-3 py-1">
						<Users size={16} strokeWidth={2} className="text-primary" />
						<span className="font-roboto text-sm text-gray-300">{like.totalVotes || 0}</span>
					</div>
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
			<div className=" mb-8 flex w-full flex-wrap justify-between">
				<div>
					<span className="text-xs font-bold">{account?.name}</span>
				</div>
				<div className=" flex flex-col items-center justify-center gap-1 self-center">
					<div className="flex flex-wrap items-center justify-center gap-x-4">
						<div className="flex flex-row items-center justify-center gap-x-1">
							<MapPinned size={15} className="text-primary" />
							<span className="text-sm text-primary">{account?.location}</span>
						</div>
						<div className="flex flex-row items-center justify-center gap-x-1">
							<PhoneCall size={14} className="" />
							<span className="text-sm ">{account?.phone}</span>
						</div>
					</div>
					<span className="text-xs text-gray-400">Inscrit {formatDate(account.created_at)}</span>
				</div>
			</div>
			<div className="mb-2 inline-flex gap-x-5 self-start rounded-lg border bg-slate-100 p-1">
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
