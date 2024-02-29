/* eslint-disable @typescript-eslint/no-explicit-any */
import { DiscussionSchemaType, getMessages } from '@/services/api/discussions';
import { getDiscussionsQueryOptions, useSendMessageMutation } from '@/utils/queryOptions';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { Bell, FileImage, Send } from 'lucide-react';
import { Key, useMemo, useState } from 'react';
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

export default function Discussion() {
	const { data: Discussions } = useSuspenseQuery(getDiscussionsQueryOptions());
	const [discSelect, setDiscSelect] = useState<DiscussionSchemaType>(Discussions[0]);
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
		queryKey: ['getMessages', discSelect.discussion_id],
		queryFn: async (page) => await getMessages(page.pageParam, discSelect.discussion_id),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			return lastPage.total > allPages.length * 16 ? allPages.length + 1 : undefined;
		},
	});
	const messages = data?.pages.map((page) => page.messages).flat() || [];
	console.log('🚀 ~ Discussion ~ messages:', messages);
	const handleScroll = (event: any) => {
		const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

		if (scrollHeight - scrollTop === clientHeight) {
			fetchNextPage();
		}
	};
	const [message, setMessage] = useState('');
	const [files, setFiles] = useState<FileList | null>(null);
	const { mutate } = useSendMessageMutation();

	function handleMutate(): void {
		if (message.length > 0 || files) {
			mutate({ discussion_id: discSelect.discussion_id, text: message, files: files?.item(0) });
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

	return (
		<div className={'flex max-h-screen w-app self-center overflow-y-auto'}>
			<div className="grid grid-cols-12 ">
				<div className="col-start-1 col-end-3 h-full overflow-y-auto border-r-2 scrollbar-thin">
					<div className={'sticky top-0 flex items-center justify-around bg-slate-50 py-2'}>
						<span className={'text-xl font-semibold'}>Discussions</span>
						<Bell size={20} />
					</div>
					<div className="flex flex-col divide-y-2 px-2 ">
						{Discussions?.map((discussion) => {
							return (
								<button
									className={twMerge(
										'flex w-full flex-col gap-y-1 p-2 transition-colors duration-300',
										discSelect.discussion_id === discussion.discussion_id && 'bg-gray-200'
									)}
									key={discussion.discussion_id}
									onClick={() => setDiscSelect(discussion)}
								>
									<div className={'flex items-center gap-x-2'}>
										<img
											src={discussion.client.avatar_url}
											alt="user profile"
											className="size-7 rounded-full"
										/>
										<span className="whitespace-pre-wrap text-sm">{discussion.client.name}</span>
									</div>
									<span className="text-sm font-black">{discussion.product.title}</span>
								</button>
							);
						})}
					</div>
				</div>
				<div className="relative col-start-3 col-end-9 border-r-2">
					<div className={'sticky top-0 bg-slate-50 py-2 pl-4'}>
						<div className={'flex items-center gap-x-2'}>
							<img src={discSelect.client.avatar_url} alt="user profile" className="size-8 rounded-full" />
							<span className="whitespace-pre-wrap text-base">{discSelect.client.name}</span>
						</div>
					</div>
					<div className="">
						<div
							className="flex h-[70dvh] max-h-[80dvh] flex-col gap-y-4 overflow-y-auto py-4 scrollbar-thin"
							onScroll={handleScroll}
						>
							<ul className="flex flex-col">
								{messages.reverse().map((message) => {
									const right = message.account_id === discSelect.provider.id;
									// const right = message.account_id === discSelect.provider.id;
									return (
										<li key={message.id} className={twMerge('flex', right ? 'self-end' : 'self-start')}>
											<div className="flex gap-x-2">
												{!right && (
													<img
														src={discSelect.client.avatar_url}
														alt="user profile"
														className="size-7 rounded-full"
													/>
												)}
												<div className="flex flex-col">
													<p
														className={twMerge(
															'text-white max-w-[70%] whitespace-pre-wrap p-2 ',
															right
																? 'bg-firstColor rounded-ee-xl rounded-s-xl text-right'
																: 'bg-gray-600 rounded-e-xl rounded-ss-xl text-left'
														)}
													>
														<span className="text-xs">{message.text}</span>
													</p>
													<span className={twMerge('text-[10px] text-black', right ? 'text-right' : 'text-left')}>
														{formatDate(message.created_at)}
													</span>
												</div>
												{right && (
													<img
														src={discSelect.client.avatar_url}
														alt="user profile"
														className="size-7 rounded-full"
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
							<div className="flex items-center justify-stretch">
								<label className="bg-slate-100 p-2" htmlFor="input_file">
									<FileImage size={20} strokeWidth={1.5} className="cursor-pointer" />
									<span className="text-xs text-slate-400">file</span>
									<input
										type="file"
										onChange={(e) => setFiles(e.target.files)}
										name=""
										accept="image/*"
										id="input_file"
										hidden
									/>
								</label>
								<textarea
									onChange={(e) => setMessage(e.target.value)}
									value={message}
									placeholder="Ecrivez votre message"
									rows={1.5}
									cols={1}
									className="m-1 w-[80%] resize-none rounded-xl border-none bg-slate-100 py-3 pl-2 outline-none"
								/>
								<button
									onClick={() => handleMutate()}
									className="flex items-center justify-center rounded-full bg-slate-100 p-2"
								>
									<Send size={22} strokeWidth={1.5} className=" " />
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="col-start-9 col-end-13 overflow-y-auto scrollbar-thin">
					<div className={'sticky top-0 flex items-center justify-around bg-slate-50 py-2'}>
						{discSelect && <div>{discSelect.product.title}</div>}
					</div>
					<div>
						<Carousel className="max-h-[300px] w-full bg-black">
							<CarouselContent>
								{discSelect.product.photos.map((image: any, index: Key | null | undefined) => (
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
					<div>
						<pre className="whitespace-pre-wrap">{discSelect.product.description}</pre>
					</div>
				</div>
			</div>
		</div>
	);
}
