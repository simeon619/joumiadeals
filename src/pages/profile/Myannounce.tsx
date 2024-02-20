/* eslint-disable react-hooks/exhaustive-deps */
import LayoutProduct1 from '@/components/product/LayoutProduct1';
import SearchFilter from '@/components/profile/SearchFilter';
import { announceRoot } from '@/lib/route';
import { getProductsByfiltrOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useDeferredValue } from 'react';
import { z } from 'zod';

const filterProductSchema = z.object({
	search: z.string(),
	price_min: z.number(),
	price_max: z.number(),
});
export type FilterProductType = z.infer<typeof filterProductSchema>; // type filter
export default function Myannounce() {
	const searchParams = announceRoot.useSearch();
	const { data: products } = useSuspenseQuery(getProductsByfiltrOptions(searchParams));
	const deferredValue = useDeferredValue(products);
	return (
		<div className="mt-8 w-full">
			<SearchFilter />
			<div className="grid grid-cols-5 gap-1">
				<div className="col-start-1 col-end-5 gap-5">
					<Suspense fallback={<div>Loading...</div>}>
						{deferredValue.products.map((product) => (
							<LayoutProduct1 key={product.product_id} product={product} />
						))}
						{deferredValue.total === 0 && <div>Aucun produit</div>}
					</Suspense>
				</div>
				<div className="col-start-5"></div>
			</div>
		</div>
	);
}
