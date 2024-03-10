/* eslint-disable react-hooks/exhaustive-deps */
import FilterProduct from '@/components/product/FilterProduct';
import LayoutProduct2 from '@/components/product/LayoutProduct2';
import { productsRoot } from '@/lib/route';
import {  getProductsOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useDeferredValue } from 'react';

import PaginatedComponent from '@/components/ui/PaginatedComponent';
export default function ProductsPage() {
	const searchParams = productsRoot.useSearch();
	const { data: products } = useSuspenseQuery(getProductsOptions(searchParams));
	const deferredValue = useDeferredValue(products);
	const totalProduct = deferredValue.total;
	return (
		<div className="flex w-app flex-col self-center">
			<FilterProduct />
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
