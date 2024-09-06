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
import { useNavigate, useRouterState } from '@tanstack/react-router';
import clsx from 'clsx';
import { useAnimate, useScroll } from 'framer-motion';
import { MapPinned, SlidersHorizontal } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFirstMountState } from 'react-use';
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

export default function FilterProduct({ style, isHeader }: { style: string; isHeader?: boolean }) {
	const filterFrom = useSearchFilter((state) => state.value);
	const [localisation, setLocalisation] = useState<string>(filterFrom.location || anyWhereInCi);
	const navigate = useNavigate({ from: productsRoot.fullPath });
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
			});
		}
	}, [animate, isHeader, scope]);
	useEffect(() => {
		if (!isHeader) return;
		animate(
			scope.current,
			{ opacity: 0, transform: 'translateY(-100%)' },
			{ duration: 0.6, ease: 'linear' }
		);
	},[filterFrom.location]);

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

	useEffect(() => {
		if (isFirstMount || !isHeader || !router.location.pathname.includes('products')) return;

		const unsubscribe = scrollYProgress.on('change', (val) => {
			delta.current = val - lastScrollY.current;
			if (delta.current > 0 && val > 0.2) {
				animate(
					scope.current,
					{ transform: 'translateY(100%)', opacity: 1 },
					{ duration: 0.6, ease: 'linear' }
				);
			} else if (delta.current < 0 || val >= 0.2) {
				animate(
					scope.current,
					{ transform: 'translateY(-100%)', opacity: 0 },
					{ duration: 0.6, ease: 'linear' }
				);
			}

			lastScrollY.current = val;
		});

		return unsubscribe;
	}, [isFirstMount, isHeader, scrollYProgress, router.location.pathname, animate, scope]);

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
				ref={scope}
				className={style}
				// style={isHeader ? { opacity: 0, transform: 'translateY(-100%)' } : {}}
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
