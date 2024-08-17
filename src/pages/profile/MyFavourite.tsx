/* eslint-disable react/jsx-no-undef */
import LayoutMini from '@/components/product/layout/LayoutMini';
import WrapProduct from '@/components/product/WrapProduct';
import { favouriteRoot } from '@/lib/route';
import { getOptionsFavouriteProduct } from '@/utils/queryOptions';
export default function MyFavourite() {
	// const searchParams = favouriteRoot.useSearch();
	// const { data: products } = useSuspenseQuery(getOptionsFavouriteProduct(searchParams));
	return (
		// <div className="grid grid-cols-5 gap-1">
		// 	<div className="col-start-1 col-end-5 gap-5">
		// 		<Suspense fallback={<div>Loading...</div>}>
		// 			{/* {deferredValue.favorites.map((product) => (
		// 			))} */}
		// 			<LayoutProduct1 products={deferredValue.favorites} />
		// 			{deferredValue.total === 0 && <div>Aucun produit</div>}
		// 		</Suspense>
		// 	</div>
		// 	<div className="col-start-5"></div>
		// </div>
		<WrapProduct
			LayoutProduct={LayoutMini}
			componentRoot={favouriteRoot}
			getData={getOptionsFavouriteProduct}
		/>
	);
}
