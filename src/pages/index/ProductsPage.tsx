/* eslint-disable react-hooks/exhaustive-deps */
import LayoutProduct2 from '@/components/product/LayoutProduct2';
import { productsRoot } from '@/lib/route';
import { getProductsOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useDeferredValue, useEffect, useRef } from 'react';

import PaginatedComponent from '@/components/ui/PaginatedComponent';
import { useHideFilter, useSearchFilter } from '@/services/state/App/filterState';
import clsx from 'clsx';
import FilterProduct from '@/components/product/filter/FilterProduct';
export default function ProductsPage() {
	const searchParams = productsRoot.useSearch();
	const { setFilter } = useSearchFilter()
	const { filter  } = productsRoot.useSearch({});
	useEffect(() => {
		setFilter(filter)
	}, [filter])

	const { data: products } = useSuspenseQuery(getProductsOptions(searchParams));
	const deferredValue = useDeferredValue(products);
	const totalProduct = deferredValue.total;
	const lastScrollTop = useRef(0);
	const { setScrollPercent, setDirection } = useHideFilter((state) => state);
	const { value } = useHideFilter((state) => state);
	const styleFilter= clsx('flex items-start justify-start p-2', {
		visible: value <= 0.1,
		invisible: value > 0.1,
	})
	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight;
			const winHeight = window.innerHeight;
			const scrollPercent = scrollTop / (docHeight - winHeight);

			if (scrollTop > lastScrollTop.current) {
				setDirection('down');
			} else if (scrollTop < lastScrollTop.current) {
				setDirection('up');
			}
			lastScrollTop.current = scrollTop;
			setScrollPercent(Number(scrollPercent));
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);
	return (
		<div className="flex w-app flex-col self-center">
			<FilterProduct style={styleFilter} />
			<div className="grid grid-cols-8 gap-1">
				<div className="col-start-1 col-end-7">
					<Suspense fallback={<div>Loading...</div>}>
						{deferredValue.products.map((product) => (
							<LayoutProduct2 key={product.product_id} product={product} />
						))}
					</Suspense>
				</div>
				<div className="col-start-7"></div>
			</div>
			<PaginatedComponent totalProduct={totalProduct} pageRoot={productsRoot} />
		</div>
	);
}
