/* eslint-disable @typescript-eslint/no-explicit-any */
// ts-ignore
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { LIMIT_PRODUCT_PAGE } from '@/utils/queryOptions';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export default function PaginatedComponent({
	totalProduct,
	pageRoot,
}: {
	totalProduct: number;
	pageRoot: any;
}) {
	const searchParams = pageRoot.useSearch();
	const [page, setPage] = useState<number>(searchParams.page || 1);
	const navigate = useNavigate({ from: pageRoot.fullPath });
	const { page: pageParam } = searchParams;

	useEffect(() => {
		if (pageParam) {
			setPage(Number(pageParam));
		}
	}, [pageParam]);

	useEffect(() => {
		// ts-ignore
		navigate({ search: (old) => ({ ...old, page: page }) });
	}, [page]);

	const totalPages = Math.ceil(totalProduct / LIMIT_PRODUCT_PAGE);

	const generatePageNumbers = () => {
		const pages = new Set<number | string>(); // Using Set to avoid duplicates
		const maxMiddlePages = 4;
		const sidePages = 1;
		if (totalPages <= maxMiddlePages + sidePages * 2) {
			for (let i = 1; i <= totalPages; i++) {
				pages.add(i);
			}
		} else {
			pages.add(1);
			if (page > sidePages + 1) {
				pages.add('...');
			}
			const start = Math.max(page - 2, 2);
			const end = Math.min(page + 2, totalPages - 1);

			for (let i = start; i <= end; i++) {
				pages.add(i);
			}
			pages.add(Math.min(totalPages, page + 1));
		}

		return Array.from(pages);
	};
	const pages = generatePageNumbers();

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
				{pages.map((pageNumber, index) =>
					pageNumber === '...' ? (
						// <PaginationItem key={index}>
						// </PaginationItem>
						<span key={index} className="block cursor-default px-4 py-[2px] text-sm text-slate-500">
							...
						</span>
					) : (
						<PaginationItem key={pageNumber}>
							<Link
								to={pageRoot.to}
								search={(old) => ({
									...old,
									page: pageNumber,
								})}
								replace={false}
								className={`block cursor-pointer text-wrap rounded-md px-4 py-[2px] text-sm capitalize ${
									pageParam === pageNumber ? 'bg-black font-bold text-white' : 'text-slate-900'
								} hover:bg-gray-300 hover:text-black`}
							>
								{pageNumber}
							</Link>
						</PaginationItem>
					)
				)}
				<PaginationItem>
					<PaginationNext
						onClick={() => {
							if (page < totalPages) {
								setPage(page + 1);
							}
						}}
						color={page === totalPages ? 'gray' : 'black'}
					/>
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
