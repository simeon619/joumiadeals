/* eslint-disable react-hooks/exhaustive-deps */
import LayoutProduct2 from '@/components/product/layout/LayoutProduct2';
import { productsRoot } from '@/lib/route';
import { getProductsOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useDeferredValue, useEffect } from 'react';

import FilterProduct from '@/components/product/filter/FilterProduct';
import WrapProduct from '@/components/product/WrapProduct';
import { useSearchFilter } from '@/services/state/App/filterState';
import clsx from 'clsx';
export default function ProductsPage() {
	const { setFilter } = useSearchFilter();
	const searchParams = productsRoot.useSearch({});
	useEffect(() => {
		setFilter(searchParams.filter);
	}, [searchParams.filter]);

	const { data: products } = useSuspenseQuery(getProductsOptions(searchParams));
	const deferredValue = useDeferredValue(products);
	const totalProduct = deferredValue.total;
	// const lastScrollTop = useRef(0);
	// const { setScrollPercent, setDirection } = useHideFilter((state) => state);
	// const { value } = useHideFilter((state) => state);

	const styleFilter = clsx(
		'flex items-start justify-start p-2 my-10 border-b-[1px] border-slate-300',
		{
			// visible: value <= 0.1,
			// invisible: value > 0.1,
		}
	);
	// useEffect(() => {
	// 	const handleScroll = () => {
	// 		const scrollTop = window.scrollY;
	// 		const docHeight = document.documentElement.scrollHeight;
	// 		const winHeight = window.innerHeight;
	// 		const scrollPercent = scrollTop / (docHeight - winHeight);

	// 		if (scrollTop > lastScrollTop.current) {
	// 			setDirection('down');
	// 		} else if (scrollTop < lastScrollTop.current) {
	// 			setDirection('up');
	// 		}
	// 		lastScrollTop.current = scrollTop;
	// 		setScrollPercent(Number(scrollPercent));
	// 	};
	// 	window.addEventListener('scroll', handleScroll);
	// 	return () => {
	// 		window.removeEventListener('scroll', handleScroll);
	// 	};
	// }, []);
	return (
		<div className="flex w-app flex-col self-center">
			<FilterProduct style={styleFilter} isHeader={false} />
			{/* <div className="grid grid-cols-8 gap-1">
				<div className="col-start-1 col-end-7">
					<Suspense fallback={<div>Loading...</div>}>
						{deferredValue.products.map((product) => (
							<LayoutProduct2 key={product.product_id} product={product} />
						))}
					</Suspense>
				</div>
				<div className="col-start-7"></div>
			</div> */}
			{/* <Suspense fallback={<div>Loading...</div>}>
				{deferredValue.products.map((product) => (
					<LayoutProduct2 key={product.product_id} product={product} />
				))}
				{deferredValue.total === 0 && <div>Aucun produit</div>}
			</Suspense> */}
			<WrapProduct
				LayoutProduct={LayoutProduct2}
				componentRoot={productsRoot}
				getData={getProductsOptions}
			/>
			{/* <PaginatedComponent totalProduct={totalProduct} pageRoot={productsRoot} /> */}
		</div>
	);
}
{
	/* <WrapProduct LayoutProduct={LayoutProduct2} componentRoot={productsOtherRoot} />  */
}
