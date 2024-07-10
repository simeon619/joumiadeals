import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useHideFilter } from '@/services/state/App/hideFilter';
import { cities } from '@/utils/mock/city';
import clsx from 'clsx';
import { MapPinned, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import CloseModal from '../ui/CloseModal';
import PopUpComponent from '../ui/PopUpComponent';
const className = {
	titleFilter: 'block py-1 text-sm font-medium text-slate-600',
	priceButton:
		'flex rounded-xl border border-slate-400 max-w-[240px] bg-white py-2 px-2 text-slate-500 shadow-sm placeholder:text-slate-500 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm',
};
export default function FilterProduct2() {
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
	const { value } = useHideFilter((state) => state);
	console.log("🚀 ~ FilterProduct ~ value:", value)

	const cityFilter = [...["Partout en cote d'ivoire"], ...cities];
	// flex items-center justify-center bg-white py-1
	return (
		<div
			className={clsx('flex items-center justify-center p-1', {
				'visible': value <= 0.10,
				'invisible': value > 0.10,
			})}
		>
			<>
				<div className={'flex items-center gap-x-2'}>
					<Select
						name="city"
						defaultValue={cityFilter[0]}
						onValueChange={(value) => setLocalisation(value)}
					>
						<SelectTrigger
							className={
								'flex h-10 max-w-[220px] rounded-xl  border-slate-400 bg-white p-2 text-slate-500 shadow-sm placeholder:text-slate-500 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm'
							}
						>
							<MapPinned size={18} className="text-slate-400" />
							<SelectValue placeholder={cities[0]} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{cityFilter.map((value) => (
								<SelectItem
									className=" font-poppins text-slate-500 focus:bg-primary"
									key={value}
									value={String(value)}
								>
									{value}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<button
						onClick={handleOpen}
						className={clsx(className.priceButton, 'flex items-center  justify-center gap-1')}
					>
						<SlidersHorizontal size={15} className="text-slate-500" />
						<span className="text-sm text-slate-500">Filtres</span>
					</button>
				</div>
				<PopUpComponent
					animationName="translateTop"
					isOpen={open}
					styleContainer={'realtive'}
					setHide={handleClose}
					position="end"
				>
					<div className="right-0 max-h-[100vh] min-w-[400px] max-w-[400px] overflow-hidden rounded-s-md bg-white shadow-2xl ">
						<div className="flex items-center justify-between border-b-[1px] border-slate-200 p-2">
							<span className="text-center text-lg font-semibold text-slate-800">Tous les filtres</span>
							<CloseModal closePopUp={handleClose} style={'size-6'} />
						</div>
						<div className={'max-h-[93vh] overflow-y-auto p-1'}>
							<p>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque et neque itaque nisi cumque
								autem aperiam magni quidem rem iusto harum numquam dignissimos non, at maxime hic
								consectetur ducimus aliquam quis accusantium eum quo sed alias quia. Officiis corrupti
								voluptate architecto mollitia laudantium culpa velit, quis eligendi tempore? Voluptatibus
								nihil harum sunt alias veritatis quod maxime sint laudantium, explicabo, eos nobis maiores
								eveniet inventore fugit ipsum omnis reprehenderit! Laboriosam mollitia quos dignissimos
								accusamus. Ipsum aliquid ut veniam voluptate quidem sed eius? Doloremque quidem expedita,
								est ullam magni et. Tenetur nemo numquam, eos nostrum dolorem repellendus consequuntur
								repellat incidunt illo velit saepe rem atque consectetur, veniam, minima eveniet reiciendis.
								Saepe recusandae eos cum provident adipisci pariatur quibusdam distinctio cupiditate,
								doloremque nam iusto ab et, illum ratione alias facilis, aliquam deleniti voluptatem.
								Voluptatibus veniam placeat, officia voluptatum tenetur dignissimos expedita quos tempora
								cum a quis ipsa ea, illum fugit totam harum, culpa maxime. Voluptatem vel distinctio nulla
								labore a temporibus, quia quas ipsa excepturi hic sint deserunt necessitatibus praesentium
								dicta, numquam mollitia aspernatur veritatis ab. Optio, iure consectetur nihil architecto
								voluptas provident iste possimus quaerat aspernatur voluptatem officia ipsam, expedita
								exercitationem alias, soluta dolores dolor quod magnam quo fuga! Iste, cum architecto.
								Repudiandae modi similique praesentium nostrum, voluptatum eligendi, sint velit fugiat
								incidunt ab eius illo. Nobis, eveniet. Doloribus, molestias ea eius labore recusandae optio?
								Placeat quisquam in quos beatae repellendus ex eos architecto cum error eligendi. Dicta ut
								accusamus delectus similique? Ratione reiciendis quis omnis velit aut? Excepturi,
								praesentium id eius voluptatum aperiam doloribus commodi non iure vero impedit dolores
								obcaecati error quisquam repudiandae? Quo dolore amet debitis atque quasi voluptatem nobis
								doloremque necessitatibus, tempore, ut incidunt mollitia ullam quia suscipit corporis
								aspernatur nulla aut consectetur ratione maiores. Ad sint dignissimos, neque nam iure ab
								enim quo accusantium? Voluptas amet illo ad quibusdam dolorem, libero necessitatibus
								tempora, quo facere blanditiis ab, excepturi vel vitae alias esse. Repellendus, enim ullam
								beatae possimus, excepturi tempore natus expedita earum rerum consequatur fugiat porro quos
								nobis quaerat officia unde, quia error assumenda quidem odio nesciunt placeat suscipit
								dolorum? Aperiam cumque quas deleniti alias. Sed ullam fuga nobis. Vero autem ipsam illum
								unde beatae, similique repudiandae quos facere quae aperiam, dolore necessitatibus
								voluptatum natus voluptatem veritatis repellendus assumenda obcaecati odit quasi itaque
								culpa excepturi labore quisquam. Sapiente aut, rerum pariatur magnam sunt laboriosam
								suscipit repellat qui odit maiores. Odio, officia. Amet modi voluptates facere aspernatur
								alias cupiditate ex, eveniet, sapiente, inventore hic aperiam fugit consequuntur. Quasi
								ratione officiis nesciunt pariatur maxime. Molestiae repudiandae minus repellendus enim
								minima corrupti odio saepe, debitis possimus rerum amet eaque placeat! Modi vero enim
								assumenda cupiditate expedita nulla blanditiis exercitationem. Autem expedita dicta commodi
								molestiae eligendi impedit officia excepturi accusamus doloribus quidem aperiam numquam
								animi, mollitia dolores, accusantium voluptatem? Possimus, incidunt adipisci debitis unde
								ullam expedita nam! Voluptas eveniet aliquam doloribus, ipsum recusandae quo neque nisi!
								Voluptate a veniam nisi voluptatibus aliquam libero magnam id, nesciunt dolorem tenetur
								commodi maxime omnis animi consequuntur aut facilis ad dolores laborum nihil ipsam numquam
								nobis? Eveniet, debitis veritatis nemo voluptatem quod, vero sunt culpa consequatur id
								laboriosam voluptas dignissimos quidem magnam laudantium corrupti? Facere, soluta vel? Fugit
								a modi aspernatur eos pariatur, nulla nesciunt mollitia ad sapiente iste, repellat
								consequuntur, voluptatibus quia itaque impedit amet molestias eius voluptas repudiandae!
								Corrupti et, deserunt harum quo inventore repellat, soluta delectus neque ut dolorem
								dolorum. Magnam veniam quas aut voluptatibus quasi eligendi praesentium, nam inventore
								commodi tempore ducimus molestias non expedita libero illum repellat. Ea, quaerat! Eaque
								iure id fuga incidunt fugit ut explicabo a sunt maiores maxime! Assumenda quisquam veritatis
								architecto nam nihil officia omnis aliquam eligendi. Beatae, nobis ducimus! Quaerat ullam
								nulla vero hic officia a. Aut non deleniti animi ex harum veniam quaerat officiis? Vitae sed
								delectus aliquam adipisci velit. Inventore quod repellat, in provident magni temporibus
								assumenda, animi hic eum excepturi fugit ipsam. Sunt sequi fugit aperiam est voluptatum
								ducimus laborum veritatis assumenda commodi architecto? Nesciunt dolorum temporibus ad.
								Beatae incidunt nam eius ratione, reiciendis optio iusto sapiente? Debitis saepe facilis
								quod cumque pariatur fugiat, nesciunt nisi quas aliquid dolores ex ab porro dignissimos
								dolor ullam neque esse suscipit odio? Distinctio illum aut accusantium totam inventore
								maiores obcaecati voluptatem illo harum, odio nihil ratione veritatis porro delectus libero
								ex ab? Eligendi officia et commodi numquam placeat reprehenderit, provident maxime
								distinctio iste recusandae sit ipsa laborum corporis pariatur rem at quos delectus, harum
								dolores! Animi beatae ullam culpa rerum rem maiores dolore odio aliquid, delectus expedita
								aut ex molestiae quo repudiandae provident necessitatibus ipsum quaerat at. Dignissimos
								dolores neque blanditiis alias enim, suscipit incidunt doloribus atque consequatur porro
								maiores culpa! In laboriosam aperiam, rerum ducimus cumque aut obcaecati distinctio
								similique maxime eius minus ad blanditiis sint nesciunt quidem sapiente vel quaerat iusto
								animi soluta autem quam quod dolores? Consectetur minus possimus fugit asperiores? Incidunt
								ad impedit, libero aperiam consequuntur, ab qui, maxime repellendus nostrum voluptatibus
								dolore vel? Unde ullam odio praesentium quia ut ab saepe enim eveniet quaerat, voluptatibus
								ea, quibusdam, voluptate animi ducimus! Saepe veritatis earum aliquam rem, quis assumenda,
								itaque nisi tenetur quos dolor odit. Autem dolor fugiat molestias perferendis quaerat
								impedit porro consequuntur inventore consectetur eius delectus nemo quidem ipsa,
								exercitationem ut! Eos exercitationem enim modi cum quam, deleniti unde est esse
								accusantium! Laborum explicabo omnis veniam culpa quos perspiciatis perferendis dolores,
								magnam odit sunt excepturi illo sapiente incidunt, mollitia dolore, vel rem. Rem error
								corporis deserunt ad nemo eos porro sit voluptatum, recusandae voluptatem explicabo possimus
								minima praesentium est illum optio, at inventore magnam omnis. Tenetur magni corporis quis
								deserunt dignissimos eum ducimus vitae, aspernatur totam. Rem accusamus sunt sequi laborum
								facere! Molestiae nobis unde ut praesentium nostrum alias architecto ducimus corrupti dolore
								quae atque rerum, quo exercitationem consequatur. Eligendi.
							</p>
						</div>
					</div>
				</PopUpComponent>
			</>
		</div>
	);
}
