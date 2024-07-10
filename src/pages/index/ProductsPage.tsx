/* eslint-disable react-hooks/exhaustive-deps */
import FilterProduct2 from '@/components/product/FilterProduct2';
import LayoutProduct2 from '@/components/product/LayoutProduct2';
import { productsRoot } from '@/lib/route';
import { getProductsOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useDeferredValue, useEffect, useRef } from 'react';

import PaginatedComponent from '@/components/ui/PaginatedComponent';
import { useHideFilter } from '@/services/state/App/hideFilter';
export default function ProductsPage() {
	const searchParams = productsRoot.useSearch();
	const { data: products } = useSuspenseQuery(getProductsOptions(searchParams));
	const deferredValue = useDeferredValue(products);
	const totalProduct = deferredValue.total;
	const lastScrollTop = useRef(0);
	const { setScrollPercent, setDirection } = useHideFilter((state) => state);
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
			setScrollPercent(Number(scrollPercent.toFixed(2)));
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);
	return (
		<div className="flex w-app flex-col self-center">
			<FilterProduct2 />
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
