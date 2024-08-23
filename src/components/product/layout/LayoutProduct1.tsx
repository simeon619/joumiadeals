/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductsMinType } from '@/services/api/product_categorie';

// import { get_caracteristique_child } from '@/utils/mock/Menucaegorie';
import ItemProductForL1 from './componentAdd/ItemProductForL1';

export default function LayoutProduct1({ products }: { products: ProductsMinType }) {
	return (
		<div className="w-full  ">
			{products.map((product) => (
				<ItemProductForL1 key={product.product_id} product={product} />
			))}
		</div>
	);
}
