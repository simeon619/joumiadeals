/* eslint-disable react-hooks/exhaustive-deps */
import LayoutProduct2 from '@/components/product/layout/LayoutProduct2';
import { productsRoot } from '@/lib/route';
import { getProductsOptions } from '@/utils/queryOptions';
import { useEffect, useRef } from 'react';

// import FilterProduct from '@/components/product/filter/FilterProduct';
import FilterProduct from '@/components/product/filter/FilterProduct';
import WrapProduct from '@/components/product/WrapProduct';
import { useSearchFilter } from '@/services/state/App/filterState';
import { useRefDomTrigger } from '@/services/state/User/domState';
export default function ProductsPage() {
	const { setFilter } = useSearchFilter();
	const scopeTrigger = useRef<HTMLDivElement>(null);
	const setScopeTrigger = useRefDomTrigger((state) => state.setScopeTrigger);
	const searchParams = productsRoot.useSearch({});

	useEffect(() => {
		setScopeTrigger(scopeTrigger);
	}, [setScopeTrigger]);

	useEffect(() => {
		setFilter(searchParams.filter);
	}, [searchParams.filter]);

	// const styleFilter = clsx(
	// 	' '
	// );

	return (
		<div className="relative flex flex-col self-center">
			<div className="hd:mt-[69px]" />
			<FilterProduct />
			<div aria-hidden="true" className="h-1 w-full bg-transparent" ref={scopeTrigger} />
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
