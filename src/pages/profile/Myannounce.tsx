/* eslint-disable react-hooks/exhaustive-deps */
import LayoutProduct1 from '@/components/product/layout/LayoutProduct1';
import WrapProduct from '@/components/product/WrapProduct';
import { announceRoot } from '@/lib/route';
import { getProductsOptions } from '@/utils/queryOptions';
import { useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import { z } from 'zod';

const filterProductSchema = z.object({
	search: z.string(),
	price_min: z.number(),
	price_max: z.number(),
});
export type FilterProductType = z.infer<typeof filterProductSchema>; // type filter
const displayStatus = [
	{ color: '#713200', label: 'En attente' },
	{ color: '#6AE535', label: 'Validé' },
	{ color: '#ef4444', label: 'Rejeté' },
	{ color: '#713200', label: 'Supprimé' },
	{ color: '#713200', label: 'En pause' },
	{ color: '#713200', label: 'Tous' },
];
export default function Myannounce() {
	const [sort, setSort] = useState<'created_at' | 'price'>('created_at');
	const [status, setStatus] = useState<number>(5);
	const [order, setOrder] = useState<'asc' | 'desc'>('desc');
	const [search, setSearch] = useState<string>('');
	const navigate = useNavigate({ from: announceRoot.fullPath });
	const searchParams = announceRoot.useSearch();

	useEffect(() => {
		setSort('created_at');
		setOrder('desc');
		setStatus(searchParams.filter?.status ?? 5);
	}, []);

	useEffect(() => {
		const v1 = sort === 'created_at' ? 'date' : 'price';
		const v2 = order === 'asc' ? 'asc' : 'desc';
		navigate({
			search: (old) => ({
				...old,
				filter: {
					...old.filter,
					status,
					order_by: `${v1}_${v2}`,
				},
			}),
		});
	}, [order, sort, status]);
	useDebounce(
		() => {
			if (search) {
				navigate({
					search: (old) => {
						return {
							...old,
							filter: {
								...old.filter,
								text: search,
							},
						};
					},
					replace: true,
				});
			} else {
				navigate({
					search: (old) => {
						return {
							...old,
							filter: {
								...old.filter,
								text: undefined,
							},
						};
					},
					replace: true,
				});
			}
		},
		500,
		[navigate, search]
	);

	return (
		<>
			<div>
				<div className="flex w-full flex-col items-start justify-center gap-2 rounded-lg border bg-gray-100 p-1">
					<div className="flex flex-row items-center gap-x-1">
						<div className="flex flex-row items-center gap-x-1">
							<span className="mx-1 text-[.8rem] font-bold text-gray-500 underline-offset-1">
								Trier par
							</span>
							<select
								className="rounded-md border bg-white  px-2 text-[.82rem] text-gray-700 outline-none focus:ring-0"
								onChange={(e) => setSort(e.target.value as 'created_at' | 'price')}
								value={sort}
							>
								<option value="created_at">Date</option>
								<option value="price">Prix</option>
							</select>
							<motion.button
								whileHover={{ scale: 1.1, rotate: 0, transition: { duration: 0.9 } }}
								whileTap={{ scale: 0.9, rotate: 90, transition: { duration: 0.9 } }}
								className="mx-1 text-xs font-bold text-gray-400 outline-none focus:ring-0"
								onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
							>
								{order === 'asc' && <ArrowDownNarrowWide size={20} className="text-gray-400" />}
								{order === 'desc' && <ArrowUpNarrowWide size={20} className="text-gray-400" />}
							</motion.button>
						</div>
						<div
							className={' m-1 flex items-center overflow-hidden rounded-xl border border-slate-300 pl-1'}
						>
							<Search size={20} strokeWidth={1.25} color="gray" />
							<input
								type={'text'}
								value={search || ''}
								onChange={(e) => setSearch(e.target.value)}
								placeholder={'Rechercher'}
								className={
									'w-full rounded-md border border-none border-slate-300 p-1 text-xs outline-none'
								}
							/>
						</div>
					</div>
					<div className="flex w-full flex-row items-center gap-2 rounded-lg border bg-gray-100 p-1">
						{displayStatus.map(({ color, label }, index) => (
							<motion.button
								key={label}
								whileTap={{ scale: 0.9, rotate: 10, transition: { duration: 0.9 } }}
								className="mx-1 text-xs font-bold text-gray-400 outline-none focus:ring-0"
								onClick={() => setStatus(index)}
							>
								<motion.div
									className={`flex items-center justify-center rounded-lg border border-slate-300 px-2 py-1 text-xs outline-none`}
									style={{
										backgroundColor: status === index ? color : 'white',
										color: status === index ? 'white' : color,
									}}
								>
									<span className=" text-[.72rem]">{label}</span>
								</motion.div>
							</motion.button>
						))}
					</div>
				</div>
			</div>
			<WrapProduct
				LayoutProduct={LayoutProduct1}
				componentRoot={announceRoot}
				getData={getProductsOptions}
			/>
		</>
	);
}
