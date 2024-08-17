/* eslint-disable react-hooks/exhaustive-deps */
import LayoutProduct1 from '@/components/product/layout/LayoutProduct1';
import WrapProduct from '@/components/product/WrapProduct';
import SearchFilter from '@/components/profile/SearchFilter';
import { announceRoot } from '@/lib/route';
import { getProductsOptions } from '@/utils/queryOptions';
import { z } from 'zod';

const filterProductSchema = z.object({
	search: z.string(),
	price_min: z.number(),
	price_max: z.number(),
});
export type FilterProductType = z.infer<typeof filterProductSchema>; // type filter
export default function Myannounce() {
	return (
		<>
			<SearchFilter componentRoot={announceRoot} />
			<WrapProduct
				LayoutProduct={LayoutProduct1}
				componentRoot={announceRoot}
				getData={getProductsOptions}
			/>
		</>
	);
}
