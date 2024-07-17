import { useHideFilter } from '@/services/state/App/filterState';
import { useEffect, useRef } from 'react';

export default function EmptyObserver() {
	const myRef = useRef<HTMLDivElement>(null);
	const { toggleValue } = useHideFilter((state) => state);

	useEffect(() => {
		if (myRef.current) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						console.log('🚀 ~ entries.forEach ~ entry:', entry.isIntersecting);
						toggleValue(entry.isIntersecting);
					});
				},
				{
					threshold: 0,
				}
			);
			observer.observe(myRef.current);
		}
	}, [myRef]);
	return <div ref={myRef}></div>;
}
