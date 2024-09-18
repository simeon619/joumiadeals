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
	{ color: '#713200', label: 'Tous', value: 5 },
	{ color: '#6AE535', label: 'Validé', value: 1 },
	{ color: '#713200', label: 'En attente', value: 0 },
	{ color: '#713200', label: 'En pause', value: 4 },
	{ color: '#ef4444', label: 'Rejeté', value: 2 },
	{ color: '#713200', label: 'Supprimé', value: 3 },
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
			{/* <div className="flex flex-col items-start  justify-center gap-2 overflow-hidden rounded-lg border bg-gray-100"> */}
			<div className="flex min-w-[320px] max-w-[460px] flex-row items-center gap-1 bg-gray-100 xs:flex-col">
				<div className="flex flex-row items-center gap-x-1">
					<span className="mx-1 whitespace-nowrap text-[.8rem] font-bold text-gray-500 underline-offset-1">
						Trier par
					</span>
					<select
						className="rounded-md border bg-white px-2 text-[.82rem] text-gray-700 outline-none focus:ring-0"
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
					className={
						'm-1 flex w-full items-center overflow-hidden rounded-xl border border-slate-300 pl-1'
					}
				>
					<Search size={20} strokeWidth={1.25} color="gray" />
					<input
						type={'text'}
						value={search || ''}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={'Rechercher'}
						className={
							'w-full rounded-md border border-none border-slate-300 px-1 py-2 text-xs outline-none'
						}
					/>
				</div>
			</div>
			{/* </div> */}
			<div className="flex min-w-[320px] max-w-[460px] gap-1 overflow-auto rounded-lg border bg-gray-100 p-1">
				{displayStatus.map(({ color, label, value }) => (
					<motion.button
						key={label}
						whileTap={{ scale: 0.9, rotate: 10, transition: { duration: 0.9 } }}
						className="mx-1 rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold outline-none focus:ring-0"
						onClick={() => setStatus(value)}
						style={{
							backgroundColor: status === value ? color : 'white',
							color: status === value ? 'white' : color,
						}}
					>
						<span className="whitespace-nowrap text-[.72rem]">{label}</span>
					</motion.button>
				))}
			</div>
			<WrapProduct
				LayoutProduct={LayoutProduct1}
				componentRoot={announceRoot}
				getData={getProductsOptions}
			/>
		</>
	);
}
