import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useShowPopupFilter } from '@/services/state/App/filterState';
import { cities } from '@/utils/mock/city';
import clsx from 'clsx';
import { MapPinned, SlidersHorizontal } from 'lucide-react';
import { useCallback, useState } from 'react';

import PopUpFilter from './PopUpFilter';
const className = {
	titleFilter: 'block py-1 text-sm font-medium text-slate-700',
	priceButton:
		'flex  rounded-xl border border-slate-400 max-w-[240px] bg-white py-2 px-2 text-slate-700 shadow-sm placeholder:text-slate-500 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm',
};
export default function FilterProduct({ style }: { style: string }) {
	const [localisation, setLocalisation] = useState<string | number | undefined>();

	const { setShowPopup } = useShowPopupFilter((state) => state);
	const handleOpen = () => {
		setShowPopup(true);
		document.body.style.overflow = 'hidden';
	};

	const handleClose = useCallback(() => {
		setShowPopup(false);
		document.body.style.overflow = 'auto';
	}, []);

	const cityFilter = [...["Partout en cote d'ivoire"], ...cities];
	// flex items-center justify-center bg-white py-1
	return (
		<>
			<div className={style}>
				<div className={'flex items-start gap-x-2'}>
					<Select
						name="city"
						defaultValue={cityFilter[0]}
						onValueChange={(value) => setLocalisation(value)}
					>
						<SelectTrigger
							className={
								'flex h-10 max-w-[220px]  rounded-xl  border-slate-400 bg-white p-2 text-slate-700 shadow-sm placeholder:text-slate-500 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
							}
						>
							<MapPinned size={18} className="mx-1 text-slate-600" />
							<SelectValue placeholder={cities[0]} />
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
					<button
						onClick={handleOpen}
						className={clsx(className.priceButton, 'flex items-center justify-center  gap-1')}
					>
						<SlidersHorizontal size={15} className="text-slate-700" />
						<span className=" text-slate-700">Filtres</span>
					</button>
				</div>
			</div>
			<PopUpFilter setShowPopup={handleClose} />
		</>
	);
}
