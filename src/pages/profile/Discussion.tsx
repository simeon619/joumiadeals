/* eslint-disable @typescript-eslint/no-explicit-any */
import { DiscussionSchemaType, getMessages } from '@/services/api/discussions';
import { getDiscussionsQueryOptions, useSendMessageMutation } from '@/utils/queryOptions';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { FileImage, Search, Send } from 'lucide-react';
import { Key, useEffect, useMemo, useRef, useState } from 'react';
import 'react-tooltip/dist/react-tooltip.css';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { URL_IMAGE } from '@/utils/constante';
import { twMerge } from 'tailwind-merge';
import { formatDate } from '@/utils/formating';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { discussionRoot } from '@/lib/route';
const MessageSchema = z.object({
	message: z.string(),
});

export type MessageSchemaType = z.infer<typeof MessageSchema>;
export default function Discussion() {
	const { data: Discussions } = useSuspenseQuery(getDiscussionsQueryOptions());
	const { mutate, isSuccess } = useSendMessageMutation();
	const { discussionId } = discussionRoot.useSearch();
	const [discSelect, setDiscSelect] = useState<DiscussionSchemaType | undefined>();
	const [search, setSearch] = useState<string>('');
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
		queryKey: ['getMessages', discSelect?.discussion_id],
		queryFn: async (page) => await getMessages(page.pageParam, discSelect?.discussion_id),
		initialPageParam: 1,
		enabled: Boolean(discSelect?.discussion_id),
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.total > allPages.length * 16 ? allPages.length + 1 : undefined;
		},
	});
	const refFetch = useRef<boolean>(false);
	const messages = useMemo(() => {
		return data?.pages.map((page) => page.messages).flat() || [];
	}, [data?.pages]);
	useEffect(() => {
		if (!discussionId) {
			return setDiscSelect(Discussions[0]);
		}
		const disc = Discussions.find((d) => d.discussion_id === discussionId);
		setDiscSelect(disc);
	}, [Discussions, discussionId]);
	useEffect(() => {
		const timeOut = setTimeout(() => {
			if (messagesEndRef.current) {
				messagesEndRef.current.scrollTo(0, messagesEndRef.current.scrollHeight);
			}
		}, 50);
		return () => {
			clearTimeout(timeOut);
		};
	}, [isSuccess]);

	const { register, handleSubmit, setValue } = useForm<MessageSchemaType>({
		resolver: zodResolver(MessageSchema),
	});

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

	function handleMutate(data: MessageSchemaType): void {
		const { message } = data;
		if (message.length > 0 || files) {
			mutate({ discussion_id: discSelect?.discussion_id, text: message, files: files?.item(0) });
			setValue('message', '');
			setFiles(null);
		}
	}

	const photo = useMemo(() => {
		if (files) {
			return URL.createObjectURL(files.item(0)!);
		}
		return null;
	}, [files]);

	const discussionFiltered = useMemo(() => {
		if (search) {
			return Discussions?.filter(
				(discussion) =>
					discussion.client.name.toLowerCase().includes(search.toLowerCase()) ||
					discussion.product.title.toLowerCase().includes(search.toLowerCase())
			);
		}
		return Discussions;
	}, [Discussions, search]);

	return (
		<div className={'flex max-h-screen w-app self-center overflow-y-auto bg-zinc-300'}>
			<div className="grid grid-cols-12 gap-x-2 p-2 ">
				<div className="col-start-1 col-end-3 h-full overflow-y-auto rounded-xl  bg-white  scrollbar-thin">
					<div className={'sticky top-0 flex items-center justify-around py-2'}>
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
					<div className="flex flex-col gap-y-3 pr-1">
						{discussionFiltered?.map((discussion) => {
							return (
								<button
									className={twMerge(
										'flex w-full flex-row p-1 gap-x-2 outline-0 border-[0px] truncate items-start transition-colors duration-300',
										discSelect?.discussion_id === discussion.discussion_id && 'bg-zinc-300 rounded-e-lg'
									)}
									key={discussion.discussion_id}
									onClick={() => setDiscSelect(discussion)}
								>
									<img src={discussion.client.avatar_url} alt="" className="size-10 rounded-md" />
									<div className={'flex w-full flex-col items-start'}>
										<span className="text-sm">{discussion.client.name}</span>
										<span className=" text-sm font-black">{discussion.product.title}</span>
									</div>
								</button>
							);
						})}
					</div>
				</div>
				<div className="relative col-start-3 col-end-9 rounded-xl bg-white px-2">
					<div className={'sticky top-0 py-2 pl-4'}>
						<div className={'flex items-center gap-x-2'}>
							<img src={discSelect?.client.avatar_url} alt="" className="size-8 rounded-full" />
							<span className="whitespace-pre-wrap text-base">{discSelect?.client.name}</span>
						</div>
					</div>
					<div className="">
						<div
							className="flex h-[70dvh] max-h-[80dvh] flex-col gap-y-4 overflow-y-auto py-4"
							onScroll={handleScroll}
							style={{ scrollbarWidth: 'thin' }}
							ref={messagesEndRef}
						>
							<ul className="flex flex-col gap-y-3">
								{messages.reverse().map((message) => {
									const right = message.account_id === discSelect?.provider.id;
									return (
										<li key={message.id} className={twMerge('flex', right ? 'self-end' : 'self-start')}>
											<div className={twMerge('flex gap-x-1')}>
												{!right && (
													<img
														src={discSelect?.client.avatar_url}
														alt="user profile"
														className="size-10 rounded-full"
													/>
												)}
												<div className={twMerge('flex mt-6  flex-col', right ? 'items-end' : 'items-start')}>
													<span
														className={twMerge(
															'text-white text-sm whitespace-pre-wrap py-1 px-2',
															right
																? 'bg-primary rounded-ee-2xl rounded-s-2xl text-right ml-44'
																: 'bg-gray-600 rounded-e-2xl rounded-ss-2xl text-left mr-44'
														)}
													>
														<RenderMessage message={message.text} />

														{/* {message.text} */}
														{message.files.length > 0 && ' 📷'}
														{message.files.length > 0 && (
															<>
																<img
																	src={URL_IMAGE + message.files[0]}
																	alt="message files"
																	className="mx-auto h-[200px]  bg-contain bg-center bg-no-repeat object-cover pb-4"
																/>
															</>
														)}
													</span>
													<span
														className={twMerge('text-[10px] text-black', right ? 'text-right' : 'text-left')}
													>
														{formatDate(message.created_at)}
													</span>
												</div>
												{right && (
													<img
														src={discSelect.client.avatar_url}
														alt="user profile"
														className="size-10 rounded-full"
													/>
												)}
											</div>
										</li>
									);
								})}
							</ul>
							{isFetchingNextPage && <div>Chargement...</div>}
						</div>
						<div className="flex flex-col border-t-2 bg-white">
							{photo && (
								<div className=" relative text-xs text-slate-400">
									<img src={photo} alt="" className="size-14" />
									<button className="absolute left-0 top-0 text-red-600" onClick={() => setFiles(null)}>
										x
									</button>
								</div>
							)}
							<div className="flex items-center justify-center bg-slate-100 ">
								<label className="p-2" htmlFor="input_file">
									<FileImage size={20} strokeWidth={1.5} className="cursor-pointer" />
									<span className="text-[0px] text-slate-400">file</span>
									<input
										type="file"
										onChange={(e) => setFiles(e.target.files)}
										name=""
										accept="image/*"
										max={1024 * 1024 * 2}
										id="input_file"
										hidden
									/>
								</label>
								<textarea
									{...register('message')}
									onKeyPress={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											handleSubmit(handleMutate)();
										}
									}}
									placeholder="Ecrivez votre message"
									rows={1}
									cols={1}
									className="m-1 w-[80%] resize-none rounded-xl border-none py-2 pl-2 outline-none"
								/>
								<button
									onClick={handleSubmit(handleMutate)}
									className="flex items-center justify-center rounded-full bg-slate-100 p-2"
								>
									<Send size={22} strokeWidth={1.5} className=" " />
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="col-start-9 col-end-13 overflow-y-auto overflow-x-hidden rounded-xl bg-white px-1 scrollbar-thin">
					<div className={'sticky top-0 flex items-center justify-around py-2'}>
						{discSelect && <div>{discSelect.product.title}</div>}
					</div>
					<div>
						<Carousel className="max-h-[300px] w-full bg-black">
							<CarouselContent>
								{discSelect?.product.photos.map((image: any, index: Key | null | undefined) => (
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
					<div className="overflow-hidden p-2 ">
						<div className="text-xs text-slate-400">Description</div>
						<pre className="whitespace-pre-wrap break-all">{discSelect?.product.description}</pre>
					</div>
					<div className="overflow-hidden p-2 ">
						<div className="text-xs text-slate-400">Caracteristiques</div>
						<div className={`flex flex-wrap items-center gap-x-3 py-1`}>
							{Object.keys(JSON.parse(discSelect?.product?.caracteristique || '{}')).map((key) => {
								return (
									<div key={key} className={'text-sm text-gray-800'}>
										<span className={`font-semibold`}>{key}:</span>
										<span className={`font-light`}>
											{JSON.parse(discSelect?.product?.caracteristique || '{}')[key]}{' '}
										</span>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// import PreviewLink from 'react-preview-link';

// ...

const RenderMessage = ({ message }: { message: string }) => {
	const linkRegex = /(https:\/\/[^\s]+)/g;
	const parts = message.split(linkRegex);

	return (
		<>
			{parts.map((part, index) => {
				if (part.match(linkRegex)) {
					return (
						<a
							key={index}
							href={part}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm text-blue-500 hover:underline"
						>
							{part}
						</a>
					);
				} else {
					return (
						<span className="text-sm" key={index}>
							{part}
						</span>
					);
				}
			})}
		</>
	);
};
