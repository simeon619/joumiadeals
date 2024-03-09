import FilterProduct from '@/components/product/FilterProduct';
import LayoutProduct2 from '@/components/product/LayoutProduct2';
import { productsRoot } from '@/lib/route';
import { LIMIT_PRODUCT_PAGE, getProductsOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useDeferredValue, useEffect, useState } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { Link, useNavigate } from '@tanstack/react-router';
export default function ProductsPage() {
	const searchParams = productsRoot.useSearch();
	const [page, setPage] = useState(1);
	const navigate = useNavigate({ from: productsRoot.fullPath });
	const { page: pageParam } = searchParams;
	useEffect(() => {
		if (pageParam) {
			setPage(Number(pageParam));
		}
	}, [pageParam]);

	useEffect(() => {
		navigate({ search: (old) => ({ ...old, page: page }), replace: true });
	}, [page]);

	const { data: products } = useSuspenseQuery(getProductsOptions(searchParams));
	const deferredValue = useDeferredValue(products);
	const totalProduct = deferredValue.total;

	const start = Math.max(page - 1, 1);
	const end = Math.min(start + 2, Math.ceil(totalProduct / LIMIT_PRODUCT_PAGE));
  
	const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

	return (
		<div className="flex w-app flex-col self-center">
			<FilterProduct />
			<div className="grid grid-cols-8 gap-1">
				<div className="col-start-1 col-end-7">
					<Suspense fallback={<div>Loading...</div>}>
						{deferredValue.products.map((product) => (
							<LayoutProduct2 key={product.product_id} product={product} />
						))}
					</Suspense>
				</div>
				<div className="col-start-7"></div>
			</div>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationPrevious
							onClick={() => {
								if (page > 1) {
									setPage(page - 1);
								}
							}}
							color={page === 1 ? 'gray' : 'black'}
						/>
					</PaginationItem>
					{/* {[...Array(Math.ceil(totalProduct / LIMIT_PRODUCT_PAGE))].map((_, index) => (
						<PaginationItem key={index}>
							<Link
								to={productsRoot.to}
								// @ts-expect-error dsd
								search={(old) => {
									return {
										...old,
										page: index + 1,
									};
								}}
								className={`block cursor-pointer text-wrap rounded-md px-4 py-[2px] text-sm capitalize ${
									pageParam === index + 1 ? 'bg-black font-bold text-white' : 'text-slate-900'
								} hover:bg-gray-300 hover:text-black`}
							>
								{index + 1}
							</Link>
						</PaginationItem>
					))} */}
					{pages.map((pageNumber) => (
						<PaginationItem key={pageNumber}>
							<Link
								to={productsRoot.to}
								search={(old) => {
									return {
										...old,
										page: pageNumber,
									};
								}}
								className={`block cursor-pointer text-wrap rounded-md px-4 py-[2px] text-sm capitalize ${
									pageParam === pageNumber ? 'bg-black font-bold text-white' : 'text-slate-900'
								} hover:bg-gray-300 hover:text-black`}
							>
								{pageNumber}
							</Link>
						</PaginationItem>
					))}
					<PaginationItem>
						<PaginationEllipsis />
					</PaginationItem>
					<PaginationItem>
						<PaginationNext
							onClick={() => {
								if (page < Math.ceil(totalProduct / LIMIT_PRODUCT_PAGE)) {
									setPage(page + 1);
								}
							}}
							color={page === Math.ceil(totalProduct / LIMIT_PRODUCT_PAGE) ? 'gray' : 'black'}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	);
}
