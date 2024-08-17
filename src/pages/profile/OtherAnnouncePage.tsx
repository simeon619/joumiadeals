import LayoutProduct2 from '@/components/product/layout/LayoutProduct2';
import WrapProduct from '@/components/product/WrapProduct';
import { productsOtherRoot } from '@/lib/route';
import { getProductsOptions } from '@/utils/queryOptions';

export default function OtherAnnouncePage() {
	return (
		<WrapProduct
			LayoutProduct={LayoutProduct2}
			componentRoot={productsOtherRoot}
			getData={getProductsOptions}
		/>
	);
}
