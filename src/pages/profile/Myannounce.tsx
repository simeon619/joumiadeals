/* eslint-disable react-hooks/exhaustive-deps */
import LayoutProduct1 from '@/components/product/LayoutProduct1';
import WrapProduct from '@/components/product/WrapProduct';
import { announceRoot } from '@/lib/route';
import { z } from 'zod';

const filterProductSchema = z.object({
	search: z.string(),
	price_min: z.number(),
	price_max: z.number(),
});
export type FilterProductType = z.infer<typeof filterProductSchema>; // type filter
export default function Myannounce() {
	
	return (
		<WrapProduct LayoutProduct={LayoutProduct1} componentRoot={announceRoot}/>
	);
}
