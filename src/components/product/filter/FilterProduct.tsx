/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useShowPopupFilter } from '@/services/state/App/filterState';
import { cities } from '@/utils/mock/city';
import { useRouterState } from '@tanstack/react-router';
import clsx from 'clsx';
import { useAnimate, useScroll } from 'framer-motion';
import { MapPinned, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFirstMountState } from 'react-use';
import { PopUpFilter } from './PopUpFilter';
const className = {
	titleFilter: 'block py-1 text-sm font-medium text-slate-700',
	priceButton:
		'flex  rounded-xl border border-slate-400 max-w-[240px] bg-white py-2 px-2 text-slate-700 shadow-sm placeholder:text-slate-500 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm',
};
// const scrollYRange = [0, 0.2, 1];
export default function FilterProduct({ style, isHeader }: { style: string; isHeader?: boolean }) {
	const [localisation, setLocalisation] = useState<string | number | undefined>();
	const { setShowPopup } = useShowPopupFilter((state) => state);
	const { scrollYProgress } = useScroll({ smooth: 1 });
	const router = useRouterState();
	const [scope, animate] = useAnimate();
	const delta = useRef(0);
	const lastScrollY = useRef(0);
	const isFirstMount = useFirstMountState();
	useEffect(() => {
		if (isHeader) {
			animate(scope.current, {
				opacity: 0,
				transform: 'translateY(-100%)',
				backGroundColor: 'rgba(100,70,80,0.9)',
			});
		}
	}, []);

	useEffect(() => {
		if (isFirstMount) return;
		const unsubscribe = scrollYProgress.on('change', (val) => {
			if (!isHeader || !router.location.pathname.includes('products')) return;
			delta.current = val - lastScrollY.current;
			if (delta.current > 0 && val > 0.2 && !isFirstMount) {
				animate(
					scope.current,
					{ transform: 'translateY(100%)', opacity: 1, backGroundColor: 'rgba(200,70,180,0.9)' },
					{ duration: 0.6, ease: 'linear' }
				);
			} else if (delta.current < 0 || val >= 0.2) {
				animate(
					scope.current,
					{ transform: 'translateY(-100%)', opacity: 0, backGroundColor: 'rgba(100,70,80,0.9)' },
					{ duration: 0.6, ease: 'linear' }
				);
			}
			lastScrollY.current = val;
		});
		return () => {
			unsubscribe();
		};
	}, [isFirstMount]);
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
			<div
				ref={scope}
				className={style}
				style={isHeader ? { opacity: 0, transform: 'translateY(-100%)' } : {}}
			>
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
						className={clsx(className.priceButton, 'flex items-center justify-center gap-1')}
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
