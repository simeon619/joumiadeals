import LayoutMini from '@/components/product/layout/LayoutMini';
import WrapProduct from '@/components/product/WrapProduct';
import { visitedRoot } from '@/lib/route';
import { getVisitedProductsOptions } from '@/utils/queryOptions';

export default function HistorisquePage() {
	// const searchParams = visitedRoot.useSearch();
	// const { data } = useQuery(getVisitedProductsOptions(searchParams));
	return (
		<div>
			<WrapProduct
				LayoutProduct={LayoutMini}
				componentRoot={visitedRoot}
				getData={getVisitedProductsOptions}
			/>
		</div>
	);
}
