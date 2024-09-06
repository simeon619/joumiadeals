/* eslint-disable @typescript-eslint/no-explicit-any */
import AvatarComponent from '@/components/ui/AvatarComponent';
import ModalReport from '@/components/ui/ModalReport';
import { discussionRoot } from '@/lib/route';
import { transmit } from '@/lib/transmit';
import { formatPrice, getAsyncUrlImage, getUrlImage } from '@/lib/utils';
import {
	checkUnreadMessages,
	DiscussionSchemaType,
	getMessages,
	ITEM_PER_PAGE,
	MessageSchemaType as MSType,
} from '@/services/api/discussions';
import { useAuth } from '@/services/state/User/auth';
import { URL_IMAGE } from '@/utils/constante';
import { formatDate } from '@/utils/formating';
import {
	getDiscussionsQueryOptions,
	useMarkAsReadMutation,
	useSendMessageMutation,
} from '@/utils/queryOptions';
import { useInfiniteQuery, useQueries, useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, FileImage, Search, Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
const MessageSchema = z.object({
	message: z.string(),
});

export type MessageSchemaType = z.infer<typeof MessageSchema>;
export default function Discussion() {
	const { mutate, isSuccess } = useSendMessageMutation();
	const [newMessages, setNewMessages] = useState<MSType[]>([]);
	const { mutate: markAsRead } = useMarkAsReadMutation();

	const subChannel = useRef<() => void>();

	const searchParams = discussionRoot.useSearch();
	const { data: Discussions } = useSuspenseQuery(getDiscussionsQueryOptions(searchParams));
	const [discSelect, setDiscSelect] = useState<DiscussionSchemaType>();
	const [search, setSearch] = useState<string>('');
	const [sort, setSort] = useState<'created_at' | 'price'>('created_at');
	const [order, setOrder] = useState<'asc' | 'desc'>('desc');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const handleMessage = (data: any) => {
		setNewMessages((prevMessages) => [data, ...prevMessages]);
		if (data.discussionId == discSelect?.discussion_id) markAsRead(data.discussionId);
	};
	const navigate = useNavigate({ from: discussionRoot.fullPath });
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
	const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
		queryKey: ['getMessages', { discussion_id: discSelect?.discussion_id }],
		queryFn: async (page) =>
			await getMessages({ page: page.pageParam, discussion_id: discSelect?.discussion_id }),
		initialPageParam: 1,
		enabled: Boolean(discSelect?.discussion_id),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.total > allPages.length * ITEM_PER_PAGE ? allPages.length + 1 : undefined;
		},
	});
	const refFetch = useRef<boolean>(false);
	const messages = useMemo(() => {
		return data?.pages.map((page) => page.messages).flat() || [];
	}, [data?.pages]);

	useEffect(() => {
		const init = async () => {
			const subscription = transmit.subscription(`1/discussion/${discSelect?.discussion_id}`);
			await subscription.create();
			subChannel.current = subscription.onMessage(handleMessage);
			setNewMessages([]);
		};
		subChannel.current?.();
		init();
		return () => subChannel.current?.();
	}, [discSelect?.discussion_id]);

	useEffect(() => {
		if (!searchParams.product_id) {
			return setDiscSelect(Discussions.results[0]);
		}
		const disc = Discussions.results.find((d) => d.product?.id === searchParams.product_id);
		setDiscSelect(disc);
		if (!disc) return;
		markAsRead(disc.discussion_id);
	}, [Discussions, searchParams]);
	const [modalReport, setModalReport] = useState(false);
	const openModalReport = () => {
		setModalReport(true);
		document.body.style.overflow = 'hidden';
	};
	const closeModalReport = () => {
		setModalReport(false);
		document.body.style.overflow = 'visible';
	};
	useEffect(() => {
		const timeOut = setTimeout(() => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollTo(0, messagesEndRef.current.scrollHeight);
			}
		}, 50);
		return () => {
			clearTimeout(timeOut);
		};
	}, [isSuccess, discSelect?.discussion_id]);

	// const { register, handleSubmit, setValue, watch } = useForm<MessageSchemaType>({
	// 	resolver: zodResolver(MessageSchema),
	// });
	// const mChat = watch('message')
	// console.log("🚀 ~ Discussion ~ mChat:", mChat)
	const [message, setMessage] = useState('');
	const handleScroll = (event: any) => {
		const { scrollTop } = event.currentTarget;
		if (scrollTop === 0 && !refFetch.current) {
			refFetch.current = true;
			fetchNextPage().finally(() => {
				refFetch.current = false;
			});
		}
	};
	// const [message, setMessage] = useState('');
	const [files, setFiles] = useState<FileList | null>(null);

	function handleMutate(): void {
		// const { message } = data;
		if (message.length > 0 || files) {
			mutate({ discussion_id: discSelect?.discussion_id, text: message, files: files?.item(0) });
			// setValue('message', '');
			setMessage('');
			setFiles(null);
		}
	}

	const photo = useMemo(() => {
		if (files) {
			return URL.createObjectURL(files.item(0)!);
		}
		return null;
	}, [files]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const adjustTextareaHeight = () => {
		const textarea = textareaRef.current;
		if (textarea && textarea.scrollHeight < 120) {
			textarea.style.height = 'auto';
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	};
	return (
		<div
			className={
				'mt-1 flex max-h-screen w-app self-center overflow-y-auto bg-slate-200 scrollbar-thin'
			}
		>
			<div className="grid h-[85dvh] max-h-[85dvh] grid-cols-16 gap-x-2 p-2 ">
				<div className="col-start-1 col-end-5 h-full overflow-y-auto rounded-xl  bg-white  scrollbar-thin">
					<div className={'sticky top-0 flex flex-col items-center justify-around py-2'}>
						<div className="flex w-full flex-row items-center gap-3 bg-white p-1 shadow-lg">
							<span className="mx-1 text-[.68rem] font-bold text-gray-500">Trier par</span>
							<div className="flex flex-row items-center gap-x-2">
								<select
									className="rounded-md border-none bg-gray-100 px-1 text-xs text-gray-700 outline-none focus:ring-0"
									onChange={(e) => setSort(e.target.value as 'created_at' | 'price')}
									value={sort}
								>
									<option value="created_at">Date</option>
									<option value="price">Prix</option>
								</select>
								<motion.button
									whileHover={{ scale: 1.1, rotate: 0, transition: { duration: 0.9 } }}
									whileTap={{ scale: 0.9, rotate: 90, transition: { duration: 0.9 } }}
									className="mx-1 text-xs font-bold text-gray-700 outline-none focus:ring-0"
									onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
								>
									{order === 'asc' && <ArrowDownNarrowWide size={16} className="text-gray-700" />}
									{order === 'desc' && <ArrowUpNarrowWide size={16} className="text-gray-700" />}
								</motion.button>
							</div>
						</div>
						<div
							className={'m-1 flex items-center overflow-hidden rounded-xl border border-slate-300 pl-1'}
						>
							<Search size={20} strokeWidth={1.25} color="gray" />
							<input
								type={'text'}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder={'Rechercher'}
								className={'w-full rounded-md border border-none border-slate-300 p-1 text-sm outline-none'}
							/>
						</div>
					</div>
					<ListDiscussion
						Discussions={Discussions.results}
						discSelect={discSelect}
						setDiscSelect={setDiscSelect}
					/>
				</div>
				<div className="col-start-5 col-end-17 grid h-[100%] grid-rows-12 overflow-y-auto  rounded-xl bg-white px-2">
					<div className={'row-start-1 row-end-2 border-b-2  border-slate-300 py-2 pl-4'}>
						<div className={'flex items-center gap-x-2'}>
							<PpProviderProduct discSelect={discSelect} />
							<div className={'flex flex-col'}>
								<span className="whitespace-pre-wrap text-base">{discSelect?.provider?.name}</span>
								<div className="text-xs">
									<span className="text-zinc-500"> mise en ligne </span>
									<span className={'font-semibold'}>{formatDate(discSelect?.product?.createdAt)}</span>
								</div>
							</div>
						</div>
					</div>
					<div
						className="row-start-2 row-end-12 flex flex-col gap-y-4 overflow-y-auto py-4"
						onScroll={handleScroll}
						style={{ scrollbarWidth: 'thin' }}
						ref={messagesEndRef}
					>
						<ListMessage messages={messages.reverse()} discSelect={discSelect} />
						<ListMessage
							messages={newMessages.sort((a, b) => Number(a.createdAt) - Number(b.createdAt))}
							discSelect={discSelect}
							info="Nouveaux messages"
						/>
						{isFetchingNextPage && <div>Chargement...</div>}
					</div>
					<div className=" row-start-13 row-end-12 flex flex-col border-t-2 bg-white/90 ">
						{photo && (
							<div className=" relative text-xs text-slate-400">
								<img src={photo} alt="" className="size-14" />
								<button className="absolute left-0 top-0 text-red-600" onClick={() => setFiles(null)}>
									x
								</button>
							</div>
						)}
						<div className="flex items-center justify-center ">
							<label className="cursor-pointer p-2" htmlFor="input_file">
								<FileImage size={20} strokeWidth={1.5} className="cursor-pointer" />
								<span className="hidden">file</span>
								<input
									type="file"
									onChange={(e) => setFiles(e.target.files)}
									name=""
									accept="image/*"
									max={1024 * 1024 * 1}
									id="input_file"
									hidden
								/>
							</label>
							<textarea
								// {...register('message')}
								onKeyUp={(e: any) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										handleMutate();
									}
								}}
								placeholder="Ecrivez votre message"
								onInput={adjustTextareaHeight}
								rows={1}
								cols={1}
								ref={textareaRef}
								value={message}
								onChange={(e: any) => setMessage(e.target.value)}
								className="w-[80%] resize-none bg-transparent py-4 text-xs text-gray-600 outline-none focus:ring-0"
							/>
							<button
								onClick={() => handleMutate()}
								className="flex items-center justify-center rounded-full p-2"
							>
								<Send
									size={22}
									strokeWidth={1.5}
									className={clsx({
										'text-blue-900': message?.length > 0,
										'text-gray-500': message?.length === 0,
									})}
								/>
							</button>
						</div>
					</div>
				</div>
				{/* <div className="col-start-12 col-end-17 overflow-y-auto overflow-x-hidden rounded-xl bg-white px-3 scrollbar-thin">
					<div className={'sticky top-0 bg-white'}>
						<div className={'mx-auto justify-around break-words bg-white p-2'}>
							{discSelect && <div>{discSelect?.product?.title}</div>}
						</div>
						<div>
							<Carousel className="max-h-[300px] w-full bg-black">
								<CarouselContent>
									{discSelect?.product?.photos.map((image: any, index: Key) => (
										<CarouselItem key={index}>
											<div
												aria-label="product image"
												className="h-[300px] w-full rounded-sm bg-contain bg-center bg-no-repeat"
												style={{
													backgroundImage: `url(${URL_IMAGE}${image})`,
												}}
												role="img"
											></div>
										</CarouselItem>
									))}
								</CarouselContent>
								<CarouselPrevious />
								<CarouselNext />
							</Carousel>
						</div>
					</div>
					<div className="overflow-hidden">
						<div className="text-base font-bold text-slate-900">Caracteristiques</div>
						<div className={`flex h-1/2 flex-wrap items-center gap-x-3 py-1`}>
							{features.map((key, index) => {
								return (
									<div key={index} className={'flex flex-row items-start gap-x-1 p-2 text-sm text-gray-800'}>
										<div className={` items-center rounded-full bg-slate-100 p-[.2rem]`}>
											<BadgeInfo size={18} strokeWidth={0.75} color="black" />
										</div>
										<span className={`flex flex-col text-xs font-light`}>
											<span className={`capitalize text-gray-500`}>{key.name}</span>
											<span className={`text-[.83rem] capitalize text-slate-950`}>{key.value}</span>
										</span>
									</div>
								);
							})}
						</div>
					</div>
					<div className="overflow-hidden">
						<div className="text-xs text-slate-400">Description</div>
						<pre className="whitespace-pre-wrap break-words p-1 font-poppins text-sm">
							{discSelect?.product?.description}
						</pre>
					</div>

					<div className={`flex items-center justify-center gap-x-2 rounded-md bg-slate-600 px-8 py-2`}>
						<a
							href={`https://api.whatsapp.com/send?phone=+225${discSelect?.provider?.phone}&text=${encodeURIComponent(SeeAnnounce)}`}
							target="_blank"
							rel="noreferrer"
							className={`text-white`}
						>
							<img
								src={'/img/whatsapp.png'}
								alt=""
								className={`size-7 bg-cover bg-center bg-no-repeat text-white`}
							/>
						</a>
						<div className={`flex gap-x-2 rounded-md bg-green-600 p-1`}>
							<Phone color="white" size={20} />
						</div>
						<Link
							to={`/product/$productId`}
							// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
							params={{ productId: discSelect?.product?.id! }}
							className=""
						>
							retour au produit
						</Link>
					</div>
					<button onClick={() => openModalReport()} className={`text-xs underline`}>
						signalez l&apos;annonce
					</button>
				</div> */}
			</div>
			<ModalReport
				showPopUp={modalReport}
				productId={discSelect?.product?.id}
				closePopUp={closeModalReport}
			/>
		</div>
	);
}

const RenderMessage = ({ message, right }: { message: string; right: boolean }) => {
	const linkRegex = /(https:\/\/[^\s]+)/g;
	const parts = message.split(linkRegex);
	return (
		<span
			className={twMerge(
				'max-w-[400px] text-slate-200  whitespace-pre-wrap break-words py-1 px-2',
				right
					? 'bg-slate-800 rounded-ee-2xl rounded-s-2xl text-right'
					: 'bg-gray-600 rounded-e-2xl rounded-es-2xl text-left'
			)}
		>
			{parts.map((part, index) => {
				if (part.match(linkRegex)) {
					return (
						<a
							key={index}
							href={part}
							target="_blank"
							rel="noopener noreferrer"
							className="text-[.7rem]  text-blue-500 hover:underline"
						>
							{part}
						</a>
					);
				} else {
					return (
						<span className="text-[.8rem]/[.29rem]" key={index}>
							{part}
						</span>
					);
				}
			})}
		</span>
	);
};

const PpProviderProduct = ({ discSelect }: { discSelect: DiscussionSchemaType | undefined }) => {
	const InfoUser = useAuth((state) => state.InfoUser);
	const [avatar, setAvatar] = useState<string>('/img/default-avatar.png');
	const user = discSelect?.provider?.id === InfoUser.id ? discSelect?.client : discSelect?.provider;
	useEffect(() => {
		if (user?.avatarUrl) {
			getAsyncUrlImage(user.avatarUrl)
				.then((url) => setAvatar(url))
				.catch(() => setAvatar('/img/default-avatar.png'));
		}
	}, [user?.avatarUrl]);

	return (
		<div className="relative mr-2 flex flex-row gap-x-2">
			<div className="relative">
				<AvatarComponent
					url={URL_IMAGE + discSelect?.product?.photos[0]}
					style="size-10 rounded-md border-2 border-primary "
				/>
				<AvatarComponent
					url={avatar}
					style="size-7 rounded-full absolute bottom-0 right-0 transform translate-x-2 translate-y-2"
					name={user?.name}
				/>
			</div>
		</div>
	);
};

const ListDiscussion = ({
	Discussions,
	discSelect,
	setDiscSelect,
}: {
	Discussions: DiscussionSchemaType[];
	discSelect: DiscussionSchemaType | undefined;
	setDiscSelect: any;
}) => {
	// const { data: unreadMsg } = useQuery(getUnreadMessagesOptions(discSelect?.discussion_id ?? 0));
	// console.log('🚀 ~ unreadMsg:', unreadMsg);
	// useEffect(() => {
	// useQueries
	// }, [discSelect?.discussion_id, Discussions]);
	const userQueries = useQueries({
		queries: Discussions?.map((discussion) => {
			return {
				queryKey: ['getUnreadMessages', discussion.discussion_id],
				queryFn: () => checkUnreadMessages(discussion.discussion_id),
			};
		}),
	});
	const { mutate: markAsRead } = useMarkAsReadMutation();
	return (
		<div className="flex flex-col gap-y-3 pr-1">
			{Discussions?.map((discussion: any, index) => {
				return (
					<button
						className={twMerge(
							'flex w-full flex-row px-1 py-3 gap-x-2 outline-0 truncate items-start transition-colors duration-300',
							discSelect?.discussion_id === discussion.discussion_id &&
								'bg-slate-200 rounded-e-lg text-black'
						)}
						key={discussion.discussion_id}
						onClick={() => {
							setDiscSelect(discussion);
							markAsRead(discussion.discussion_id);
						}}
					>
						<PpProviderProduct discSelect={discussion} />
						<div className={'flex w-full flex-col items-start'}>
							{/* <span className="text-xs ">{discussion.client?.name}</span> */}
							<span className=" font-roboto text-xs">{discussion.product?.title}</span>
							<span className=" text-xs">{formatPrice(discussion.product?.price ?? 0)}</span>
							<span className=" text-[.68rem] text-gray-500">
								{formatDate(discussion.lastMessage?.createdAt)}
							</span>
						</div>
						{/* <span>{data}</span> */}

						{userQueries[index].data ? (
							<span className="rounded-full bg-primary p-1 text-center font-roboto text-xs text-white">
								{userQueries[index].data}
							</span>
						) : null}
					</button>
				);
			})}
		</div>
	);
};

const ListMessage = ({
	messages,
	discSelect,
	info,
}: {
	messages: MSType[];
	discSelect: DiscussionSchemaType | undefined;
	info?: string;
}) => {
	const InfoUser = useAuth((state) => state.InfoUser);
	// const [avatar, setAvatar] = useState<string>('/img/default-avatar.png');
	const downloadFile = async (urlFile: string) => {
		try {
			const response = await fetch(urlFile, {
				mode: 'cors',
			});

			if (!response.ok) {
				throw new Error("Erreur lors du téléchargement de l'image");
			}

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);

			const a = document.createElement('a');
			a.href = url;
			a.download = `${discSelect?.product?.title}-${Date.now().toString()}`;
			a.target = '_blank';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Erreur:', error);
			alert('Le téléchargement a échoué.');
		}
	};
	if (messages.length === 0) return null;
	return (
		<div className="flex flex-col gap-y-3">
			<div className="text-center text-xs text-slate-400">{info}</div>
			{messages.map((message) => {
				const right = message.accountId == InfoUser.id;
				// let avatar = '';
				const avatarUrl =
					message.accountId == discSelect?.client?.id
						? discSelect?.client?.avatarUrl
						: discSelect?.provider?.avatarUrl;
				const avatarName =
					message.accountId == discSelect?.client?.id
						? discSelect?.client?.name
						: discSelect?.provider?.name;

				// getUrlImage(avatarUrl)
				// 	.then((url) => avatar = url)
				// 	.catch(() => avatar = '/img/default-avatar.png');
				return (
					<div key={message.id} className={twMerge('flex', right ? 'justify-end' : 'justify-start')}>
						<div className={twMerge('flex items-start gap-x-2')}>
							{!right && <AvatarComponent style="size-7 rounded-full" url={getUrlImage(avatarUrl)} name={avatarName} />}
							<div
								className={twMerge(
									'flex flex-col mt-5',
									right ? 'items-end text-right' : 'items-start text-left'
								)}
							>
								<RenderMessage message={message.text} right={right} />
								{message.files.length > 0 && (
									<div className="group relative mt-2">
										<img
											src={URL_IMAGE + message.files[0]}
											alt=""
											className="h-[350px] bg-contain bg-center bg-no-repeat shadow-md"
										/>
										<button
											onClick={() => downloadFile(URL_IMAGE + message.files[0])}
											className="absolute bottom-1 right-1 z-10 rounded bg-blue-500 px-2 py-1 text-xs text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
										>
											Télécharger
										</button>
									</div>
								)}
								<span className="mt-1 text-[.68rem] text-gray-500">{formatDate(message.createdAt)}</span>
							</div>
							{right && <AvatarComponent style="size-7 rounded-full" url={getUrlImage(avatarUrl)} name={avatarName} />}
						</div>
					</div>
				);
			})}
		</div>
	);
};
