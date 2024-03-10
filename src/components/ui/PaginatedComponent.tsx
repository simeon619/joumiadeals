/* eslint-disable @typescript-eslint/no-explicit-any */
//ts-ignore
import { useEffect, useState } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
// import { productsRoot } from '@/lib/route';
import { LIMIT_PRODUCT_PAGE } from '@/utils/queryOptions';
import { Link, useNavigate } from '@tanstack/react-router';
export default function PaginatedComponent({
	totalProduct,
	pageRoot,
}: {
	totalProduct: number;
	pageRoot: any;
}) {
	const searchParams = pageRoot.useSearch();
	const [page, setPage] = useState<number>(1);
	const navigate = useNavigate({ from: pageRoot.fullPath });
	const { page: pageParam } = searchParams;
	useEffect(() => {
		if (pageParam) {
			setPage(Number(pageParam));
		}
	}, [pageParam]);
	useEffect(() => {
		//ts-ignore
		navigate({ search: (old) => ({ ...old, page: page }), replace: true });
	}, [page]);

	const totalPages = Math.ceil(totalProduct / LIMIT_PRODUCT_PAGE);

	let start = Math.max(page - 1, 1);
	let end = Math.min(start + 2, totalPages);

	if (totalPages < 3) {
		start = 1;
		end = totalPages;
	}

	const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
	return (
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
				{pages.map((pageNumber) => (
					<PaginationItem key={pageNumber}>
						<Link
							to={pageRoot.to}
							search={(old) => {
								return {
									...old,
									page: pageNumber,
								};
							}}
							replace={false}
							hidden
							className={`block cursor-pointer text-wrap rounded-md px-4 py-[2px] text-sm capitalize ${
								pageParam === pageNumber ? 'bg-black font-bold text-white' : 'text-slate-900'
							} hover:bg-gray-300 hover:text-black`}
						>
							{pageNumber}
						</Link>
					</PaginationItem>
				))}
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
	);
}
