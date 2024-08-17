/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductsMinType } from '@/services/api/product_categorie';
import { useSuspenseQuery } from '@tanstack/react-query';
import React, { Suspense, useDeferredValue } from 'react';
import PaginatedComponent from '../ui/PaginatedComponent';

export default function WrapProduct({
	componentRoot,
	LayoutProduct,
	getData,
}: {
	componentRoot: any;
	LayoutProduct: React.FC<{ products: ProductsMinType }>;
	getData: any;
}) {
	const searchParams = componentRoot.useSearch();
	const { data: products, isLoading, isPending } = useSuspenseQuery(getData(searchParams)) as any;
	const deferredValue = useDeferredValue(products);
	const totalProduct = deferredValue?.total || 0;
	// const [deferredValue, setDeferredValue] = useState(products);
	// useEffect(() => {
	// 	const handleDeferredValue = () => setDeferredValue(products);
	// 	handleDeferredValue();
	// }, [products]);

	if (isLoading) {
		return <div>recuperation des données en cours...</div>;
	}
	if (isPending) {
		return <div>Loading...</div>;
	}

	return (
		<div className="mt-2 w-full">
			{/* <SearchFilter componentRoot={componentRoot} /> */}
			<Suspense fallback={<div>Loading...</div>}>
				<LayoutProduct
					products={deferredValue?.products || deferredValue?.favorites || deferredValue?.visited || []}
				/>
				{deferredValue?.total === 0 && <div>Aucun produit</div>}
			</Suspense>
			<PaginatedComponent totalProduct={totalProduct} pageRoot={componentRoot} />
		</div>
	);
}
