import { FilterProductType } from '@/pages/profile/Myannounce';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce, useFirstMountState } from 'react-use';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { twMerge } from 'tailwind-merge';
import { announceRoot } from '@/lib/route';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from '@tanstack/react-router';
const filterProductSchema = z.object({
	search: z.string(),
	price_min: z.number(),
	price_max: z.number(),
});
const filt = {
	'date croissant': 'date_asc',
	'date decroissant': 'date_desc',
	'prix croissant': 'price_asc',
	'prix decroissant': 'price_desc',
} as const;
export default memo(function SearchFilter() {
	// const searchParams = announceRoot.useSearch();
	const { register, watch } = useForm<FilterProductType>({
		resolver: zodResolver(filterProductSchema),
	});

	const navigate = useNavigate({ from: announceRoot.fullPath });
	const searchTerm = watch('search');
	const price = watch(['price_min', 'price_max']);

	const array = [
		'date croissant',
		'date decroissant',
		'prix croissant',
		'prix decroissant',
	] as const;
	const [orderBy, setOrderBy] = useState<keyof typeof filt>();

	useDebounce(
		() => {
			if (price && (price[0] || price[1])) {
				let max = 0;
				let min = 0;
				if (!isNaN(price[0]) && isNaN(price[1])) {
					min = price[0];
					max = 2e10;
				}
				if (!isNaN(price[1]) && isNaN(price[0])) {
					max = price[1];
					min = 0;
				}
				if (!isNaN(price[1]) && !isNaN(price[0])) {
					min = Math.min(price[0], price[1]);
					max = Math.max(price[0], price[1]);
				}

				navigate({
					search: (old) => {
						return {
							...old,
							filter: {
								...old.filter,
								price: [min, max] || undefined,
							},
						};
					},
					replace: true,
				});
			}
		},
		500,
		[navigate, price]
	);

	useEffect(() => {
		if (orderBy) {
			navigate({
				search: (old) => {
					return {
						...old,
						filter: {
							...old.filter,
							order_by: filt[orderBy],
						},
					};
				},
				replace: true,
			});
		}
	}, [navigate, orderBy]);

	useDebounce(
		() => {
			navigate({
				search: (old) => {
					return {
						...old,
						filter: {
							...old.filter,
							text: searchTerm || undefined,
						},
					};
				},
				replace: true,
			});
		},
		500,
		[navigate, searchTerm]
	);

	return (
		<div className="mb-16 flex flex-wrap items-center justify-start gap-4 px-4 ">
			<div className=" ">
				<span className="block text-sm font-medium text-slate-700">Rechercher</span>
				<input
					type={'text'}
					inputMode="search"
					{...register('search')}
					name={'search'}
					className={twMerge(
						`mt-1 flex rounded-md border w-[200px] border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`
					)}
					placeholder={'trouver une annonce'}
					// defaultValue={searchParams.filter?.text}
				/>
			</div>
			<div className=" ">
				<span className="block text-sm font-medium text-slate-700">Prix</span>
				<div className="flex gap-2">
					<input
						type={'number'}
						inputMode="numeric"
						{...register('price_min', { valueAsNumber: true })}
						name={'price_min'}
						className={twMerge(
							`mt-1 flex w-1/4 rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`
						)}
						placeholder={'Minimum'}
					/>
					<input
						type={'number'}
						inputMode="numeric"
						{...register('price_max', { valueAsNumber: true })}
						name={'price_max'}
						className={twMerge(
							`mt-1 flex w-1/4 rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`
						)}
						placeholder={'Maximum'}
					/>
				</div>
			</div>

			<div className={twMerge('w-1/5')}>
				<span className=" text-sm font-medium text-slate-700 ">{'Classer par :'}</span>
				<Select
					name="order"
					defaultValue={array[0]}
					onValueChange={(value) => {
						//@ts-expect-error value is string
						setOrderBy(value);
					}}
				>
					<SelectTrigger className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm">
						<SelectValue placeholder={array[0]} />
					</SelectTrigger>
					<SelectContent className="bg-white">
						{array.map((value) => (
							<SelectItem className="font-poppins focus:bg-primary" key={value} value={String(value)}>
								{value}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
});
