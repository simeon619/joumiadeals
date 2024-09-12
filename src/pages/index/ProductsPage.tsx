/* eslint-disable react-hooks/exhaustive-deps */
import LayoutProduct2 from '@/components/product/layout/LayoutProduct2';
import { productsRoot } from '@/lib/route';
import { getProductsOptions } from '@/utils/queryOptions';
import { useEffect, useRef } from 'react';

// import FilterProduct from '@/components/product/filter/FilterProduct';
import WrapProduct from '@/components/product/WrapProduct';
import { useSearchFilter } from '@/services/state/App/filterState';
import clsx from 'clsx';
import FilterProduct from '@/components/product/filter/FilterProduct';
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

	const styleFilter = clsx(
		'my-2 flex items-start justify-start border-slate-300 p-2'
	);

	return (
		<div className="relative flex flex-col self-center">
			<FilterProduct  style={styleFilter} />
			<div className="h-1 w-full bg-transparent" ref={scopeTrigger} />
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
