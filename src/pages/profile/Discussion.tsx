import { DiscussionSchemaType } from '@/services/api/discussions';
import { getDiscussionsQueryOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
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
	const [discSelect, setDiscSelect] = useState<DiscussionSchemaType>(Discussions[0]);
	console.log('🚀 ~ Discussion ~ discSelect:', discSelect);
	return (
		<div className={' h-screen '}>
			<div className="grid h-2/3 grid-cols-12 ">
				<div className="col-start-1 col-end-3 h-full overflow-y-auto bg-slate-400  scrollbar-thin">
					<div className={'sticky top-0 flex items-center justify-around bg-slate-50 py-2'}>
						<span className={'text-xl font-semibold'}>Discussions</span>
						<Bell size={20} />
					</div>
					<div className="flex flex-col gap-y-2 p-2 ">
						{Discussions?.map((discussion) => {
							return (
								<button
									className={'flex flex-col gap-x-2'}
									key={discussion.client.id}
									onClick={() => setDiscSelect(discussion)}
								>
									<div className={'flex items-center gap-x-2'}>
										<img
											src={discussion.client.avatar_url}
											alt="user profile"
											className="size-7 rounded-full"
										/>
										<span className="text-sm">{discussion.client.name}</span>
									</div>
									<span className="text-sm">{discussion.product.title}</span>
								</button>
							);
						})}
					</div>
				</div>
				<div className="col-start-3 col-end-9 border-r-2">
					<div className={'sticky top-0 flex items-center justify-around border bg-slate-50 py-2'}>
						{discSelect && <div>{discSelect.client.name}</div>}
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
				</div>
			</div>
		</div>
	);
}
