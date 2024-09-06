/* eslint-disable @typescript-eslint/no-explicit-any */
import DisplayForumMessage from '@/components/message/DisplayForumMessage';
import AvatarComponent from '@/components/ui/AvatarComponent';
import ImagePagination from '@/components/ui/ImagePagination';
import { noticesAccountRoot } from '@/lib/route';
import { formatPrice, getUrlImage } from '@/lib/utils';
import { DiscussionSchemaType } from '@/services/api/discussions';
import { useAuth } from '@/services/state/User/auth';
import { URL_IMAGE } from '@/utils/constante';
import { formatDate } from '@/utils/formating';
import { getDiscussionsQueryOptions, useSendMessageMutation } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Search } from 'lucide-react';
import { useDeferredValue, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'react-use';
type ModifiedDiscussionSchemaType = Omit<DiscussionSchemaType, 'client' | 'provider'>;
// type DiscussionType = ModifiedDiscussionSchemaType['account'] &
// 	ModifiedDiscussionSchemaType['product'] & {
// 		discussion_id: number;
// 	};
export default function AvisPage() {
	const [text, setText] = useState('');
	const searchParams = noticesAccountRoot.useSearch();
	const [sort, setSort] = useState<'created_at' | 'price'>('created_at');
	const [order, setOrder] = useState<'asc' | 'desc'>('desc');
	const [element, setElement] = useState<ModifiedDiscussionSchemaType>();
	const { data: discussions, isLoading } = useSuspenseQuery(
		getDiscussionsQueryOptions(searchParams)
	);
	const { data: account } = useSuspenseQuery(
		getDiscussionsQueryOptions({
			provider_id: searchParams.provider_id,
			filter: { type: 'provider' },
		})
	);
	const [acc, setAcc] = useState<{ id: number; account: DiscussionSchemaType['provider'] }>({
		id: account?.results[0].discussion_id,
		account: account?.results[0]['account'],
	});

	const deferredValue = useDeferredValue(discussions?.results);
	const totalProduct = deferredValue?.length || 0;
	const navigate = useNavigate({ from: noticesAccountRoot.fullPath });

	useEffect(() => {
		setSort('created_at');
		setOrder('desc');
	}, []);

	useEffect(() => {
		const v1 = sort === 'created_at' ? 'date' : 'price';
		const v2 = order === 'asc' ? 'asc' : 'desc';
		navigate({
			search: (old) => ({
				...old,
				filter: {
					...old.filter,
					order_by: `${v1}_${v2}`,
				},
			}),
		});
	}, [order, sort]);

	useDebounce(
		() => {
			if (text) {
				navigate({
					search: (old) => ({
						...old,
						filter: {
							...old.filter,
							text,
						},
					}),
				});
			} else {
				navigate({
					search: (old) => ({
						...old,
						filter: {
							...old.filter,
							text: undefined,
						},
					}),
				});
			}
		},
		500,
		[text]
	);
	// Ajoutez ces fonctions pour gérer les événements de clic
	const handleDiscussionClick = (produit: any, discussion_id: number) => {
		setElement({ ...produit, discussion_id });
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}
	return (
		<div className="mt-2 w-full">
			<div className="flex w-full flex-row gap-2">
				<div className="sticky top-16 flex h-[60vh] w-[200px]  flex-col items-stretch gap-2 overflow-y-auto ">
					<div className="flex flex-row gap-x-2 rounded-md bg-slate-100 p-2">
						<Search size={18} className="text-gray-500" />
						<input
							placeholder="Rechercher discussion"
							className="w-full truncate border-none bg-transparent text-xs text-gray-500 outline-none focus:ring-0"
							onChange={(e) => setText(e.target.value)}
						/>
					</div>
					<button
						onClick={() => {
							handleDiscussionClick(acc.account, acc.id);
						}}
						className="flex flex-row gap-x-2"
					>
						<div className="flex w-full flex-row items-start justify-start gap-2 border-b border-gray-200  p-2 shadow-md shadow-slate-100">
							<img src={getUrlImage(acc.account?.avatarUrl)} alt="" className="size-[30px] rounded-lg" />
							<div className="flex flex-col items-start gap-y-1">
								<span className="text-xs font-bold">{acc.account?.name}</span>
								<span className="text-xs text-gray-500">{acc.account?.location}</span>
							</div>
						</div>
					</button>
					<h1 className="font-poppins text-[.75rem]">
						{totalProduct} Discusion{totalProduct > 1 ? 's' : ''}{' '}
					</h1>
					<div className="flex flex-row items-center p-1">
						<span className="mx-1 text-[.68rem] font-bold text-gray-500">Trier par</span>
						<select
							className="rounded-md border-none bg-gray-100 px-1 text-xs text-gray-500 outline-none focus:ring-0"
							onChange={(e) => setSort(e.target.value as 'created_at' | 'price')}
							value={sort}
						>
							<option value="created_at">Date</option>
							<option value="price">Prix</option>
						</select>
						<motion.button
							whileHover={{ scale: 1.1, rotate: 0, transition: { duration: 0.9 } }}
							whileTap={{ scale: 0.9, rotate: 90, transition: { duration: 0.9 } }}
							className="mx-1 text-xs font-bold text-gray-500 outline-none focus:ring-0"
							onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
						>
							{order === 'asc' && <ArrowDownNarrowWide size={16} className="text-gray-500" />}
							{order === 'desc' && <ArrowUpNarrowWide size={16} className="text-gray-500" />}
						</motion.button>
					</div>
					{deferredValue.map((discussion) => (
						<button
							key={discussion.discussion_id}
							onClick={() => {
								const data = discussion['product'] || discussion['account'];
								handleDiscussionClick(data, discussion.discussion_id);
							}}
							className="flex flex-row gap-x-2"
						>
							{discussion.product && (
								<div
									className={clsx(
										'flex w-full flex-row items-center gap-2 rounded-md border border-gray-200 p-1 pb-2 shadow-2xl shadow-slate-100',
										{ 'bg-gray-100 ': discussion.discussion_id === element?.discussion_id },
										{ 'bg-white ': discussion.discussion_id !== element?.discussion_id }
									)}
								>
									<img
										src={URL_IMAGE + discussion.product?.photos[0]}
										alt=""
										className="size-[40px] rounded-lg"
									/>
									<div className="flex flex-col items-start gap-y-1 truncate">
										<span className=" text-xs font-bold">{discussion.product?.title}</span>
										<span className="text-xs text-gray-500">{formatPrice(discussion.product?.price)}</span>
										<span className="rounded-md text-[.68rem] text-gray-500">
											{formatDate(discussion.product?.createdAt)}
										</span>
									</div>
								</div>
							)}
						</button>
					))}
				</div>
				<div className="w-full">{<DiscussionDetail discussion={element} />}</div>
			</div>
		</div>
	);
}

const DiscussionDetail = ({ discussion }: { discussion: any }) => {
	// const [messages, setMessages] = useState<MessageSchemaType[]>([]);
	// const [isLoading, setIsLoading] = useState(false);
	const [focus, setFocus] = useState(false);
	const [message, setMessage] = useState('');
	const InfoUser = useAuth((s) => s.InfoUser);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const { mutate: sendMessage, isError: isErrorSendMessage } = useSendMessageMutation();

	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = 'auto';
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};
	if (!discussion)
		return (
			<div className="w-full text-center text-sm text-gray-500">Aucune discussion sélectionnée...</div>
		);
	console.log(discussion?.avatarUrl);

	return (
		<div className="flex w-full flex-col gap-y-2">
			<div className={clsx({})}>
				{discussion?.title && (
					<div className="flex w-full flex-row items-start justify-start gap-2 border p-2 shadow-md shadow-slate-100">
						{/* <img src={URL_IMAGE + discussion?.photos[0]} alt="" className="size-[30px] rounded-lg" /> */}
						<ImagePagination
							photos={discussion?.photos || []}
							style={{ imageStyle: 'w-[400px] h-[200px] object-cover' }}
						/>
						<div className="flex w-full flex-col items-start gap-2 border-b border-gray-200 p-2 shadow-slate-100">
							<span className="text-[.95rem] font-bold">{discussion?.title}</span>
							<span className="text-[.80rem] text-gray-500">{formatPrice(discussion?.price)}</span>
							<span className=" rounded-md  bg-slate-100 text-[.68rem] text-gray-500">
								{formatDate(discussion?.createdAt)}
							</span>
						</div>
					</div>
				)}
				{discussion?.name && (
					<div className="flex w-full flex-row items-start justify-start gap-2 border-b border-gray-200  p-2 shadow-md shadow-slate-100">
						<img src={getUrlImage(discussion?.avatarUrl)} alt="" className="size-[30px] rounded-lg" />
						<div className="flex flex-col items-start gap-y-1">
							<span className="text-xs font-bold">{discussion?.name}</span>
							<span className="text-xs text-gray-500">{discussion?.location}</span>
						</div>
					</div>
				)}
			</div>
			<div className="flex size-full flex-row items-start justify-start gap-2 border-b border-gray-200 p-1 shadow-xl shadow-slate-100">
				<AvatarComponent style="size-[35px]" url={getUrlImage(InfoUser?.avatar_url)} name={InfoUser?.name} />
				<textarea
					placeholder="Ajouter un message..."
					ref={textareaRef}
					className="w-full resize-none bg-transparent py-4 text-xs text-gray-500 outline-none focus:ring-0"
					onInput={adjustTextareaHeight}
					onFocus={() => setFocus(true)}
					onBlur={() => setFocus(false)}
					rows={1}
					value={message}
					style={{ overflow: 'hidden' }}
					onChange={(e) => setMessage(e.target.value)}
				/>
			</div>
			<motion.div
				animate={{
					opacity: focus || message.length > 0 ? 1 : 0,
					scale: focus || message.length > 0 ? 1 : 0.99,
					display: focus || message.length > 0 ? 'flex' : 'none',
				}}
				transition={{ duration: 0.1 }}
				className="flex w-full scale-100 flex-row items-center justify-end gap-x-4 p-2 opacity-100"
			>
				<button
					onClick={() => setMessage('')}
					className="rounded-md px-2 py-1 font-poppins text-sm capitalize text-black outline-none transition-all duration-300 focus:ring-0"
				>
					annuler
				</button>
				<button
					disabled={message.length === 0}
					onClick={() => {
						sendMessage({ discussion_id: discussion?.discussion_id, text: message });
						setMessage('');
					}}
					className={clsx(
						'rounded-md px-2 py-1 font-poppins text-xs outline-none transition-all duration-300 focus:ring-0',
						{
							'bg-gray-100 text-black': message.length === 0,
							'bg-blue-500 text-white': message.length > 0,
						}
					)}
				>
					Ajoutez un avis
				</button>
			</motion.div>
			<DisplayForumMessage discussionId={discussion?.discussion_id} />
		</div>
	);
};
