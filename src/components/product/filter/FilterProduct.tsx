/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { productsRoot } from '@/lib/route';
import { useSearchFilter, useShowPopupFilter } from '@/services/state/App/filterState';
import { cities } from '@/utils/mock/city';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
// import { useAnimate, useScroll } from 'framer-motion';
import { useRefDomTrigger } from '@/services/state/User/domState';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPinned, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PopUpFilter } from './PopUpFilter';

const CLASSES = {
	titleFilter: 'block py-1 text-sm font-medium text-slate-700',
	priceButton:
		'flex rounded-xl border border-slate-400 max-w-[240px] bg-white py-2 px-2 text-slate-700 shadow-sm placeholder:text-slate-500 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm',
	selectTrigger:
		'flex h-10 rounded-xl border-slate-400 bg-white px-4 text-slate-700 shadow-sm placeholder:text-slate-500 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
	selectItem: 'font-poppins text-slate-700 focus:bg-primary',
};

const anyWhereInCi = "Partout en Côte d'Ivoire";

gsap.registerPlugin(ScrollTrigger);
export default function FilterProduct() {
	const filterFrom = useSearchFilter((state) => state.value);
	const [localisation, setLocalisation] = useState<string>(filterFrom.location || anyWhereInCi);
	const navigate = useNavigate({ from: productsRoot.fullPath });
	const { setShowPopup } = useShowPopupFilter((state) => state);
	const scopeAnima = useRef(null);
	const scopeTrigger = useRefDomTrigger((state) => state.scopeTrigger);

	useEffect(() => {
		if (!scopeAnima.current || !scopeTrigger) return;
		const animation = gsap.to(scopeAnima.current, {
			position: 'fixed',
			zIndex: 50,
			left: 0,
			right: 0,
			top: 25,
			marginTop: 35,
			display: 'flex',
			justifyItems: 'center',
			justifyContent: 'center',
			// backgroundColor: 'rgb(255,255,250)',
			borderBottom: '1px solid rgb(229, 231, 235)',
			boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
			duration: 2,
			ease: 'elastic.inOut',
			scrollTrigger: {
				trigger: scopeTrigger.current,
				start: 'top top',
				end: 'bottom top',
				toggleActions: 'play reverse play reverse',
				scrub: true,
			},
		});
		return () => {
			if (animation.scrollTrigger) {
				animation.scrollTrigger.kill();
			}
			animation.kill();
		};
	}, [scopeTrigger]);

	useEffect(() => {
		setLocalisation(filterFrom.location || anyWhereInCi);
	}, [filterFrom]);

	useEffect(() => {
		navigate({
			search: (old) => ({
				...old,
				filter: {
					...old.filter,
					location: localisation.includes(anyWhereInCi) ? undefined : localisation,
				},
			}),
			replace: true,
		});
	}, [localisation, navigate]);

	const handleOpen = () => {
		setShowPopup(true);
		document.body.style.overflow = 'hidden';
	};

	const handleClose = useCallback(() => {
		setShowPopup(false);
		document.body.style.overflow = 'auto';
	}, [setShowPopup]);

	const cityFilter = [anyWhereInCi, ...cities];

	return (
		<>
			<div
				ref={scopeAnima}
				className={'relative top-[20px] z-1 flex max-h-fit  items-start justify-start bg-white pb-2'}
				// style={{
				// 	minHeight: '60px',
				// 	position: 'relative',
				// 	zIndex: 1,
				// 	left: 0,
				// 	right: 0,
				// 	top: 20,
				// }}
			>
				<div className="flex items-start gap-x-2">
					<Select name="city" onValueChange={(value) => setLocalisation(value)} value={localisation}>
						<SelectTrigger className={CLASSES.selectTrigger}>
							<MapPinned size={18} className="mx-1 text-slate-600" />
							<SelectValue placeholder={cities[0]} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{cityFilter.map((value) => (
								<SelectItem className={CLASSES.selectItem} key={value} value={String(value)}>
									{value}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<button
						onClick={handleOpen}
						className={clsx(CLASSES.priceButton, 'flex items-center justify-center gap-1')}
					>
						<SlidersHorizontal size={15} className="text-slate-700" />
						<span className="text-slate-700">Filtres</span>
					</button>
				</div>
			</div>
			<PopUpFilter setShowPopup={handleClose} />
		</>
	);
}
