import { cities } from '@/utils/mock/city';
import { useEffect, useRef, useState } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { twMerge } from 'tailwind-merge';
import { HandCoins, MapPinned, SlidersHorizontal, X } from 'lucide-react';
import PopUpComponent from '../ui/PopUpComponent';
import CloseModal from '../ui/CloseModal';
import { useHideFilter } from '@/services/state/App/hideFilter';
const className = {
	titleFilter: 'block py-1 text-sm font-medium text-slate-600',
	priceButton:
		' border border-slate-300 bg-white w-1/3 py-[9px] text-slate-700  shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm',
};
export default function FilterProduct() {
	const [localisation, setLocalisation] = useState<string | number | undefined>();
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
		document.body.style.overflow = 'hidden';
	};

	const handleClose = () => {
		setOpen(false);
		document.body.style.overflow = 'auto';
	};
	const myRef = useRef<HTMLDivElement>(null);
	const { toggleValue } = useHideFilter((state) => state);

	useEffect(() => {
		if (myRef.current) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && entry.intersectionRatio === 1) {
							toggleValue(true);
						} else if (!entry.isIntersecting && entry.intersectionRatio === 0) {
							toggleValue(false);
						}
					});
				},
				{
					threshold: 0,
				}
			);
			observer.observe(myRef.current);
		}
	}, [myRef]);
	const cityFilter = [...["Partout en cote d'ivoire"], ...cities];

	return (
		<>
			<div ref={myRef} className={'mt-8 '}>
				<div className={'flex items-center gap-x-3'}>
					<div className={twMerge('w-[280px]')}>
						<label htmlFor="city" className={className.titleFilter}>
							Choisir une localisation
						</label>
						<Select
							name="city"
							defaultValue={cityFilter[0]}
							onValueChange={(value) => setLocalisation(value)}
						>
							<SelectTrigger className="flex rounded-xl border border-slate-300 bg-white px-3 py-5 text-slate-700 shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm">
								<MapPinned className="text-slate-500" /> <SelectValue placeholder={cities[0]} />
							</SelectTrigger>
							<SelectContent className="bg-white">
								{cityFilter.map((value) => (
									<SelectItem
										className="font-poppins text-slate-700 focus:bg-primary"
										key={value}
										value={String(value)}
									>
										{value}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className={twMerge('')}>
						<span className={twMerge([className.titleFilter, 'flex items-center gap-x-2'])}>
							<HandCoins size={22} className="text-slate-500" />
							<span>Choisir un prix</span>
						</span>
						<div className="flex">
							<button className={twMerge([className.priceButton, 'w-[80px] rounded-s-xl'])}>min</button>
							<button className={twMerge([className.priceButton, ' w-[80px] rounded-e-xl'])}>max</button>
						</div>
					</div>
					<div className="w-[380px]">
						<span className={className.titleFilter}>Affiner vos recherches</span>
						<button
							onClick={handleOpen}
							className={twMerge([
								className.priceButton,
								'flex py-[7px] justify-center gap-x-4 items-center rounded-xl ',
							])}
						>
							<SlidersHorizontal className="text-slate-500" />
							<span className="">Filtres</span>
						</button>
					</div>
				</div>
			</div>

			<PopUpComponent
				animationName="translateRight"
				isOpen={open}
				styleContainer={'flex justify-end h-full  w-full'}
			>
				<div className="h-full w-[400px] bg-slate-50 shadow-2xl ">
					<div className="sticky inset-x-0 flex items-center justify-between bg-gray-200 p-3">
						<span className="text-center text-lg font-semibold text-slate-800">Tous les filtres</span>
						<CloseModal closePopUp={handleClose} style={'size-6'} />
					</div>
					<div className={'h-full overflow-y-scroll'}>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque et neque itaque nisi cumque
							autem aperiam magni quidem rem iusto harum numquam dignissimos non, at maxime hic consectetur
							ducimus aliquam quis accusantium eum quo sed alias quia. Officiis corrupti voluptate
							architecto mollitia laudantium culpa velit, quis eligendi tempore? Voluptatibus nihil harum
							sunt alias veritatis quod maxime sint laudantium, explicabo, eos nobis maiores eveniet
							inventore fugit ipsum omnis reprehenderit! Laboriosam mollitia quos dignissimos accusamus.
							Ipsum aliquid ut veniam voluptate quidem sed eius? Doloremque quidem expedita, est ullam
							magni et. Tenetur nemo numquam, eos nostrum dolorem repellendus consequuntur repellat
							incidunt illo velit saepe rem atque consectetur, veniam, minima eveniet reiciendis. Saepe
							recusandae eos cum provident adipisci pariatur quibusdam distinctio cupiditate, doloremque
							nam iusto ab et, illum ratione alias facilis, aliquam deleniti voluptatem. Voluptatibus
							veniam placeat, officia voluptatum tenetur dignissimos expedita quos tempora cum a quis ipsa
							ea, illum fugit totam harum, culpa maxime. Voluptatem vel distinctio nulla labore a
							temporibus, quia quas ipsa excepturi hic sint deserunt necessitatibus praesentium dicta,
							numquam mollitia aspernatur veritatis ab. Optio, iure consectetur nihil architecto voluptas
							provident iste possimus quaerat aspernatur voluptatem officia ipsam, expedita exercitationem
							alias, soluta dolores dolor quod magnam quo fuga! Iste, cum architecto. Repudiandae modi
							similique praesentium nostrum, voluptatum eligendi, sint velit fugiat incidunt ab eius illo.
							Nobis, eveniet. Doloribus, molestias ea eius labore recusandae optio? Placeat quisquam in
							quos beatae repellendus ex eos architecto cum error eligendi. Dicta ut accusamus delectus
							similique? Ratione reiciendis quis omnis velit aut? Excepturi, praesentium id eius voluptatum
							aperiam doloribus commodi non iure vero impedit dolores obcaecati error quisquam repudiandae?
							Quo dolore amet debitis atque quasi voluptatem nobis doloremque necessitatibus, tempore, ut
							incidunt mollitia ullam quia suscipit corporis aspernatur nulla aut consectetur ratione
							maiores. Ad sint dignissimos, neque nam iure ab enim quo accusantium? Voluptas amet illo ad
							quibusdam dolorem, libero necessitatibus tempora, quo facere blanditiis ab, excepturi vel
							vitae alias esse. Repellendus, enim ullam beatae possimus, excepturi tempore natus expedita
							earum rerum consequatur fugiat porro quos nobis quaerat officia unde, quia error assumenda
							quidem odio nesciunt placeat suscipit dolorum? Aperiam cumque quas deleniti alias. Sed ullam
							fuga nobis. Vero autem ipsam illum unde beatae, similique repudiandae quos facere quae
							aperiam, dolore necessitatibus voluptatum natus voluptatem veritatis repellendus assumenda
							obcaecati odit quasi itaque culpa excepturi labore quisquam. Sapiente aut, rerum pariatur
							magnam sunt laboriosam suscipit repellat qui odit maiores. Odio, officia. Amet modi
							voluptates facere aspernatur alias cupiditate ex, eveniet, sapiente, inventore hic aperiam
							fugit consequuntur. Quasi ratione officiis nesciunt pariatur maxime. Molestiae repudiandae
							minus repellendus enim minima corrupti odio saepe, debitis possimus rerum amet eaque placeat!
							Modi vero enim assumenda cupiditate expedita nulla blanditiis exercitationem. Autem expedita
							dicta commodi molestiae eligendi impedit officia excepturi accusamus doloribus quidem aperiam
							numquam animi, mollitia dolores, accusantium voluptatem? Possimus, incidunt adipisci debitis
							unde ullam expedita nam! Voluptas eveniet aliquam doloribus, ipsum recusandae quo neque nisi!
							Voluptate a veniam nisi voluptatibus aliquam libero magnam id, nesciunt dolorem tenetur
							commodi maxime omnis animi consequuntur aut facilis ad dolores laborum nihil ipsam numquam
							nobis? Eveniet, debitis veritatis nemo voluptatem quod, vero sunt culpa consequatur id
							laboriosam voluptas dignissimos quidem magnam laudantium corrupti? Facere, soluta vel? Fugit
							a modi aspernatur eos pariatur, nulla nesciunt mollitia ad sapiente iste, repellat
							consequuntur, voluptatibus quia itaque impedit amet molestias eius voluptas repudiandae!
							Corrupti et, deserunt harum quo inventore repellat, soluta delectus neque ut dolorem dolorum.
							Magnam veniam quas aut voluptatibus quasi eligendi praesentium, nam inventore commodi tempore
							ducimus molestias non expedita libero illum repellat. Ea, quaerat! Eaque iure id fuga
							incidunt fugit ut explicabo a sunt maiores maxime! Assumenda quisquam veritatis architecto
							nam nihil officia omnis aliquam eligendi. Beatae, nobis ducimus! Quaerat ullam nulla vero hic
							officia a. Aut non deleniti animi ex harum veniam quaerat officiis? Vitae sed delectus
							aliquam adipisci velit. Inventore quod repellat, in provident magni temporibus assumenda,
							animi hic eum excepturi fugit ipsam. Sunt sequi fugit aperiam est voluptatum ducimus laborum
							veritatis assumenda commodi architecto? Nesciunt dolorum temporibus ad. Beatae incidunt nam
							eius ratione, reiciendis optio iusto sapiente? Debitis saepe facilis quod cumque pariatur
							fugiat, nesciunt nisi quas aliquid dolores ex ab porro dignissimos dolor ullam neque esse
							suscipit odio? Distinctio illum aut accusantium totam inventore maiores obcaecati voluptatem
							illo harum, odio nihil ratione veritatis porro delectus libero ex ab? Eligendi officia et
							commodi numquam placeat reprehenderit, provident maxime distinctio iste recusandae sit ipsa
							laborum corporis pariatur rem at quos delectus, harum dolores! Animi beatae ullam culpa rerum
							rem maiores dolore odio aliquid, delectus expedita aut ex molestiae quo repudiandae provident
							necessitatibus ipsum quaerat at. Dignissimos dolores neque blanditiis alias enim, suscipit
							incidunt doloribus atque consequatur porro maiores culpa! In laboriosam aperiam, rerum
							ducimus cumque aut obcaecati distinctio similique maxime eius minus ad blanditiis sint
							nesciunt quidem sapiente vel quaerat iusto animi soluta autem quam quod dolores? Consectetur
							minus possimus fugit asperiores? Incidunt ad impedit, libero aperiam consequuntur, ab qui,
							maxime repellendus nostrum voluptatibus dolore vel? Unde ullam odio praesentium quia ut ab
							saepe enim eveniet quaerat, voluptatibus ea, quibusdam, voluptate animi ducimus! Saepe
							veritatis earum aliquam rem, quis assumenda, itaque nisi tenetur quos dolor odit. Autem dolor
							fugiat molestias perferendis quaerat impedit porro consequuntur inventore consectetur eius
							delectus nemo quidem ipsa, exercitationem ut! Eos exercitationem enim modi cum quam, deleniti
							unde est esse accusantium! Laborum explicabo omnis veniam culpa quos perspiciatis perferendis
							dolores, magnam odit sunt excepturi illo sapiente incidunt, mollitia dolore, vel rem. Rem
							error corporis deserunt ad nemo eos porro sit voluptatum, recusandae voluptatem explicabo
							possimus minima praesentium est illum optio, at inventore magnam omnis. Tenetur magni
							corporis quis deserunt dignissimos eum ducimus vitae, aspernatur totam. Rem accusamus sunt
							sequi laborum facere! Molestiae nobis unde ut praesentium nostrum alias architecto ducimus
							corrupti dolore quae atque rerum, quo exercitationem consequatur. Eligendi.
						</p>
					</div>
				</div>
			</PopUpComponent>
		</>
	);
}
