/* eslint-disable react-hooks/exhaustive-deps */
import LayoutProduct2 from '@/components/product/layout/LayoutProduct2';
import { productsRoot } from '@/lib/route';
import { getProductsOptions } from '@/utils/queryOptions';
import { useEffect } from 'react';

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

	const styleFilter = clsx(
		'my-10 flex items-start justify-start border-b-[1px] border-slate-300 p-2'
	);

	return (
		<div className="flex flex-col self-center">
			<FilterProduct style={styleFilter} isHeader={false} />
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
