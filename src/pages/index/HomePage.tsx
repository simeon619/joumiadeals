import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel';
import SetAdvert from '@/components/ui/setAdvert';
import { dataSubCategorie } from '@/utils/mock/sousCatItem';
export default function HomePage() {
	return (
		// <div className="flex flex-row justify-center gap-2 p-2">
		<>
			<div className="hd:mt-[69px]" />
			<div className="flex flex-col  self-center py-1">
				<div className="mt-2 flex flex-col items-center justify-center rounded-md bg-slate-200 p-2">
					<h1 className="text-center font-poppins text-xl">Faites vos premiers revenue en vendant</h1>
					<SetAdvert />
				</div>
				<div className="mt-6 flex flex-col items-center justify-center">
					<div className="flex flex-col items-center justify-center">
						<Carousel
							opts={{
								align: 'center',
							}}
							className="w-[950px]"
						>
							<CarouselContent>
								{dataSubCategorie.map((item, index) => (
									<CarouselItem key={index} className="py-3 md:basis-1/2 lg:basis-1/4">
										<div key={item.name} className={`aspect-square h-[105px] w-[200px]`}>
											<div
												className={`relative flex justify-center overflow-hidden rounded-md bg-cover bg-center bg-no-repeat transition-transform duration-300 hover:scale-105`}
												style={{
													backgroundImage: `url(${item.url})`,
													width: '100%',
													height: '100%',
												}}
												role="img"
												aria-label={item.name}
											>
												<div className="absolute bottom-0 size-full bg-gradient-to-t from-slate-900" />
												<span className="absolute bottom-[40%] font-bold text-slate-50">{item.name}</span>
											</div>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
						<div className="flex flex-col items-center justify-center">
							<h1 className="mt-12 text-center font-poppins text-2xl">
								Le meilleur site de pettite annonce en cote d&apos;ivoire.
							</h1>
							<span className="cursor-pointer font-poppins text-sm hover:text-primary">
								Voir toutes les annonces &gt;&gt;&gt;
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
		// </div>
	);
}
