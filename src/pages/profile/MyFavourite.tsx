/* eslint-disable react/jsx-no-undef */
import LayoutProduct1 from '@/components/product/LayoutProduct1';
import { favouriteRoot } from '@/lib/route';
import { getOptionsFavouriteProduct } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import React, { Suspense, useDeferredValue } from 'react';

export default function MyFavourite() {
	const searchParams = favouriteRoot.useSearch();
	const { data: products } = useSuspenseQuery(getOptionsFavouriteProduct(searchParams));
	const deferredValue = useDeferredValue(products);
	return (
		<div className="grid grid-cols-5 gap-1">
			<div className="col-start-1 col-end-5 gap-5">
				<Suspense fallback={<div>Loading...</div>}>
					{deferredValue.favorites.map((product) => (
						<LayoutProduct1 key={product.product_id} product={product} />
					))}
					{deferredValue.total === 0 && <div>Aucun produit</div>}
				</Suspense>
			</div>
			<div className="col-start-5"></div>
		</div>
	);
}
