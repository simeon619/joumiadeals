import { MessageSchemaType } from '@/services/api/discussions';
import { formatDate } from '@/utils/formating';
import { accountQueryOptions, getLikeOptions, useToggleLikeMutation } from '@/utils/queryOptions';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Loader, ThumbsDown, ThumbsUp, Users } from 'lucide-react';
import AvatarComponent from '../ui/AvatarComponent';

export default function ItemMessage({ message }: { message: MessageSchemaType }) {
	const { data: account, isPending } = useQuery(accountQueryOptions(message.accountId));

	const { data: like } = useSuspenseQuery(getLikeOptions({ id: message.id, type: 'message' }));
	const { mutate: toggleLike } = useToggleLikeMutation();

	const handleLike = (value: -1 | 1) => {
		toggleLike({ id: message.id, type: 'message', value });
	};

	// if (isPending) {
	// 	return (
	// 		<div className="flex size-full items-center justify-center">
	// 			<Loader size={20} color="gray" className="animate-spin" />
	// 		</div>
	// 	);
	// }
	return (
		<div key={message.id} className="rounded-lg bg-white p-2 shadow-sm">
			<div className="flex flex-row items-center gap-x-1">
				<AvatarComponent url={account?.avatar_url} style="size-[30px]" />
				<span className="font-roboto text-xs text-gray-900">{account?.name}</span>
				<span className="block text-[.70rem] text-gray-500">{formatDate(message.createdAt)}</span>
			</div>
			<span className="pl-[35px] text-xs/3 text-gray-900">{message.text}</span>
			<div
				className={clsx(
					'mt-1 flex  flex-row items-center justify-between rounded-lg border-t border-gray-300 px-2 py-1 text-white'
					// {
					// 	'bg-blue-400/40': like.mylike === 1,
					// 	'bg-red-400/40': like.mylike === -1,
					// 	'bg-gray-600/40': like.mylike === 0,
					// }
				)}
			>
				<div className="flex flex-row items-center justify-center gap-x-5 rounded-full px-2 py-1">
					<ThumbsUp
						size={16}
						strokeWidth={1.8}
						className={clsx('cursor-pointer hover:text-blue-400', {
							'text-blue-500': like.mylike === 1,
							'text-black': like.mylike !== 1,
						})}
						onClick={() => handleLike(1)}
					/>
					<span className="font-roboto text-xs text-black/70">{like.totalLikes || 0}</span>
					<ThumbsDown
						size={16}
						strokeWidth={1.8}
						className={clsx('cursor-pointer hover:text-red-400', {
							'text-red-500': like.mylike === -1,
							'text-black': like.mylike !== -1,
						})}
						onClick={() => handleLike(-1)}
					/>
				</div>
				<div className=" flex flex-row items-center justify-center gap-x-[1px] rounded-full px-2 py-1">
					<Users size={14} strokeWidth={1.8} className="text-black" />
					<span className="font-poppins text-xs font-semibold text-black">{like.totalVotes || 0}</span>
				</div>
			</div>
		</div>
	);
}
