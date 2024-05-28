/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, useDeferredValue } from 'react'
import SearchFilter from '../profile/SearchFilter'
import PaginatedComponent from '../ui/PaginatedComponent'
import { useSuspenseQuery } from '@tanstack/react-query';
import { getProductsByfiltrOptions } from '@/utils/queryOptions';
import {  ProductsMinType } from '@/services/api/product_categorie';

export default function WrapProduct({componentRoot, LayoutProduct} : {componentRoot: any, LayoutProduct: React.FC<{product: ProductsMinType[0]}>}) {
    const searchParams = componentRoot.useSearch();
	const { data: products } = useSuspenseQuery(getProductsByfiltrOptions(searchParams));
	const deferredValue = useDeferredValue(products);
	const totalProduct = deferredValue.total;
  return (
    <div className="mt-2 w-full">
    <SearchFilter componentRoot={componentRoot} />
    <div className="grid grid-cols-5 gap-1">
        <div className="col-start-1 col-end-5 gap-5">
            <Suspense fallback={<div>Loading...</div>}>
                {deferredValue.products.map((product) => (
                    <LayoutProduct key={product.product_id} product={product} />
                ))}
                {deferredValue.total === 0 && <div>Aucun produit</div>}
            </Suspense>
        </div>
        <div className="col-start-5"></div>
    </div>
    <PaginatedComponent totalProduct={totalProduct} pageRoot={componentRoot} />
</div>
  )
}
