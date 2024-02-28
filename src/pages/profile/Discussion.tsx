import { DiscussionSchemaType } from '@/services/api/discussions';
import { getDiscussionsQueryOptions, useSendMessageMutation } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Bell, FileImage, Send } from 'lucide-react';
import { useState } from 'react';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import { URL_IMAGE } from '@/utils/constante';

export default function Discussion() {
	const { data: Discussions } = useSuspenseQuery(getDiscussionsQueryOptions());
	const { mutate } = useSendMessageMutation()

	const [discSelect, setDiscSelect] = useState<DiscussionSchemaType>(Discussions[0]);
	return (
		<div className={' h-screen '}>
			<div className="grid h-2/3 grid-cols-12 ">
				<div className="col-start-1 col-end-3 h-full overflow-y-auto border-r-2 scrollbar-thin">
					<div className={'sticky top-0 flex items-center justify-around bg-slate-50 py-2'}>
						<span className={'text-xl font-semibold'}>Discussions</span>
						<Bell size={20} />
					</div>
					<div className="flex flex-col divide-y-2 px-2 ">
						{Discussions?.map((discussion) => {
							return (
								<button
									className={'flex w-full flex-col gap-y-1 p-2'}
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
					<div className={'sticky top-0 border bg-slate-50 py-2 pl-4'}>
						<div className={'flex items-center gap-x-2'}>
							<img src={discSelect.client.avatar_url} alt="user profile" className="size-7 rounded-full" />
							<span className="whitespace-pre-wrap text-sm">{discSelect.client.name}</span>
						</div>
					</div>

					<div className="absolute inset-x-0 bottom-0 h-[55px] bg-white">
						<div className="flex items-center justify-stretch">
							<label className="p-2" htmlFor="input_file">
								<FileImage size={20} strokeWidth={1.5} className="cursor-pointer" />
								<span className="text-xs">file</span>
								<input type="file" name="" accept='image/*' id="input_file" hidden />
							</label>
							<textarea
								placeholder="Ecrivez votre message"
								rows={1.5}
								cols={1}
								className="m-1 w-4/5 rounded-xl border-none bg-slate-100 py-3 pl-2 outline-none"
							/>
							<button onClick={(e) => {
								mutate({ discussion_id: discSelect.discussion_id, text: 'test' })
							}} className="flex items-center justify-center rounded-full bg-primary p-2">
								<Send size={25} strokeWidth={1.5} className=" " />
							</button>
						</div>
					</div>
				</div>
				<div className="col-start-9 col-end-13 overflow-y-auto scrollbar-thin">
					<div className={'sticky top-0 flex items-center justify-around bg-slate-50 py-2'}>
						{discSelect && <div>{discSelect.product.title}</div>}
					</div>
					<div>
						<Carousel className="max-h-[300px] w-full">
							<CarouselContent>
								{discSelect.product.photos.map((image, index) => (
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
