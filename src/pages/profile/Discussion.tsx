/* eslint-disable @typescript-eslint/no-explicit-any */
import { DiscussionSchemaType, getMessages } from '@/services/api/discussions';
import { getDiscussionsQueryOptions, useSendMessageMutation } from '@/utils/queryOptions';
import { useInfiniteQuery, useSuspenseQuery } from '@tanstack/react-query';
import { BadgeInfo, FileImage, Phone, Search, Send } from 'lucide-react';
import { Key, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { SeeAnnounce, URL_IMAGE } from '@/utils/constante';
import { twMerge } from 'tailwind-merge';
import { formatDate } from '@/utils/formating';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { discussionRoot } from '@/lib/route';
import AvatarComponent from '@/components/ui/AvatarComponent';
import ModalReport from '@/components/ui/ModalReport';
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
		<div className={'mt-1 flex max-h-screen w-app self-center overflow-y-auto bg-slate-400'}>
			<div className="grid h-[85dvh] max-h-[85dvh] grid-cols-16 gap-x-2 p-2 ">
				<div className="col-start-1 col-end-4 h-full overflow-y-auto rounded-xl  bg-white  scrollbar-thin">
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
										'flex w-full flex-row p-1 gap-x-2 outline-0 truncate items-start transition-colors duration-300',
										discSelect?.discussion_id === discussion.discussion_id &&
											'bg-slate-400 rounded-e-lg text-white'
									)}
									key={discussion.discussion_id}
									onClick={() => setDiscSelect(discussion)}
								>
									<AvatarComponent
										url={discSelect?.client.avatar_url}
										style="size-10 rounded-md border-2 border-slate-300"
										name={discSelect?.client.name}
									/>
									<div className={'flex w-full flex-col items-start'}>
										<span className="text-sm ">{discussion.client.name}</span>
										<span className=" text-sm font-black">{discussion.product.title}</span>
									</div>
								</button>
							);
						})}
					</div>
				</div>
				<div className="col-start-4 col-end-12 grid h-[100%] grid-rows-12 overflow-y-auto  rounded-xl bg-white px-2">
					<div className={'row-start-1 row-end-2 py-2  pl-4'}>
						<div className={'flex items-center gap-x-2'}>
							<AvatarComponent
								url={discSelect?.client.avatar_url}
								style="w-10 rounded-md border-2 border-slate-300"
								name={discSelect?.client.name}
							/>
							<div className={'flex flex-col'}>
								<span className="whitespace-pre-wrap text-base">{discSelect?.client.name}</span>
								<div className="text-xs">
									<span className="text-zinc-500">produit mise en ligne </span>
									<span className={'font-semibold'}>{formatDate(discSelect?.product.created_at)}</span>
								</div>
							</div>
						</div>
					</div>
					<div
						className="row-start-2  row-end-12 flex flex-col gap-y-4 overflow-y-auto py-4"
						onScroll={handleScroll}
						style={{ scrollbarWidth: 'thin' }}
						ref={messagesEndRef}
					>
						<ul className="flex flex-col gap-y-3">
							{messages.reverse().map((message) => {
								const right = message.account_id === discSelect?.provider.id;
								return (
									<li key={message.id} className={twMerge('flex ', right ? 'self-end' : 'self-start')}>
										<div className={twMerge('flex gap-x-1')}>
											{!right && (
												<AvatarComponent url={discSelect?.client.avatar_url} name={discSelect?.client.name} />
											)}
											<div className={twMerge('flex mt-6  flex-col', right ? 'items-end' : 'items-start')}>
												<span
													className={twMerge(
														'max-w-[70%] text-sm whitespace-pre-wrap break-words py-1 px-2',
														right
															? 'bg-lime-300 rounded-ee-2xl rounded-s-2xl text-right'
															: 'bg-gray-600 rounded-e-2xl rounded-es-2xl text-white text-left'
													)}
												>
													<RenderMessage message={message.text} />

													{message.files.length > 0 && (
														<img
															src={URL_IMAGE + message.files[0]}
															alt=""
															className="mx-auto h-[200px]  bg-cover bg-center  bg-no-repeat object-cover pb-4"
														/>
													)}
												</span>
												<span className={twMerge('text-[10px] text-black', right ? 'text-right' : 'text-left')}>
													{formatDate(message.created_at)}
												</span>
											</div>
											{right && (
												<AvatarComponent url={discSelect?.client.avatar_url} name={discSelect?.client.name} />
											)}
										</div>
									</li>
								);
							})}
						</ul>
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
						<div className="flex items-center justify-center  ">
							<label className="cursor-pointer p-2" htmlFor="input_file">
								<FileImage size={20} strokeWidth={1.5} className="cursor-pointer" />
								<span className="text-[0px] text-slate-400">file</span>
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
								{...register('message')}
								onKeyUp={(e) => {
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
								className="flex items-center justify-center rounded-full p-2"
							>
								<Send size={22} strokeWidth={1.5} className=" " />
							</button>
						</div>
					</div>
				</div>
				<div className="col-start-12 col-end-17 overflow-y-auto overflow-x-hidden rounded-xl bg-white px-3 scrollbar-thin">
					<div className={'sticky top-0 bg-white'}>
						<div className={'mx-auto justify-around break-words bg-white p-2'}>
							{discSelect && <div>{discSelect.product.title}</div>}
						</div>
						<div>
							<Carousel className="max-h-[300px] w-full bg-black">
								<CarouselContent>
									{discSelect?.product.photos.map((image: any, index: Key) => (
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
							{Object.keys(JSON.parse(discSelect?.product?.caracteristique || '{}')).map((key) => {
								return (
									<div key={key} className={'flex flex-row items-start gap-x-1 p-2 text-sm text-gray-800'}>
										<div className={` items-center rounded-full bg-slate-100 p-[.2rem]`}>
											<BadgeInfo size={18} strokeWidth={0.75} color="black" />
										</div>
										<span className={`flex flex-col text-xs font-light`}>
											<span className={`capitalize text-gray-500`}>{key}</span>
											<span className={`text-[.83rem] capitalize text-slate-950`}>
												{JSON.parse(discSelect?.product?.caracteristique || '{}')[key]}
											</span>
										</span>
									</div>
								);
							})}
						</div>
					</div>
					<div className="overflow-hidden">
						<div className="text-xs text-slate-400">Description</div>
						<pre className="whitespace-pre-wrap break-words p-1 font-poppins text-sm">
							{discSelect?.product.description}
						</pre>
					</div>

					<div className={`flex items-center justify-center gap-x-2 rounded-md bg-slate-600 px-8 py-2`}>
						<a
							href={`https://api.whatsapp.com/send?phone=+225${discSelect?.provider.phone}&text=${encodeURIComponent(SeeAnnounce)}`}
							target="_blank"
							rel="noreferrer"
							className={`text-white`}
						>
							<img
								src={'/img/WhatsApp.webp'}
								alt=""
								className={`size-7 bg-cover bg-center bg-no-repeat text-white`}
							/>
						</a>
						<div className={`flex gap-x-2 rounded-md bg-green-600 p-1`}>
							<Phone color="white" />
						</div>
						<Link
							to={`/product/$productId`}
							// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
							params={{ productId: discSelect?.product.id! }}
							className=""
						>
							retour au produit
						</Link>
					</div>
					<button onClick={() => openModalReport()} className={`text-xs underline`}>
						signalez l&apos;annonce
					</button>
				</div>
			</div>
			<ModalReport
				showPopUp={modalReport}
				productId={discSelect?.product?.id}
				closePopUp={closeModalReport}
			/>
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
