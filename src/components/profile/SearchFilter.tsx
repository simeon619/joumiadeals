/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { FilterProductType } from '@/pages/profile/Myannounce';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'react-use';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
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

const className = {
	input: `mt-1 flex rounded-full border w-[200px] border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-f focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`,
};
export default function SearchFilter({ componentRoot }: { componentRoot: any }) {
	const searchParams = componentRoot.useSearch() ;
	const { register, watch } = useForm<FilterProductType>({
		resolver: zodResolver(filterProductSchema),
	});
	function getKeyByValue(object: { [s: string]: unknown } | ArrayLike<unknown>, value: unknown) {
		return Object.entries(object).find(([_, val]) => val === value)?.[0];
	}
	const navigate = useNavigate({ from: componentRoot.fullPath }) as any;
	const searchTerm = watch('search');
	const price = watch(['price_min', 'price_max']);
	const { filter: filtParams } = searchParams;
	const [orderBy, setOrderBy] = useState<keyof typeof filt>();

	useEffect(() => {
		if (filtParams?.price) {
			navigate({
				search: (old) => {
					return {
						...old,
						filter: {
							...old.filter,
							price: filtParams?.price,
						},
					};
				},
				replace: true,
			});
		}
	}, [filtParams?.price]);

	useEffect(() => {
		if (filtParams?.order_by) {
			navigate({
				search: (old) => {
					return {
						...old,
						filter: {
							...old.filter,
							order: filtParams?.order_by,
						},
					};
				},
				replace: true,
			});
		}
	}, [filtParams?.order_by]);

	useEffect(() => {
		if (filtParams?.text) {
			navigate({
				search: (old) => {
					return {
						...old,
						filter: {
							...old.filter,
							text: filtParams?.text,
						},
					};
				},
				replace: true,
			});
		}
	}, [filtParams?.text]);

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
								price: [min, max],
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
								price: undefined,
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
			if (searchTerm) {
				navigate({
					search: (old) => {
						return {
							...old,
							filter: {
								...old.filter,
								text: searchTerm,
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
		[navigate, searchTerm]
	);

	return (
		<div className="mb-8 flex flex-wrap items-center justify-start gap-4 px-4 ">
			<div className=" ">
				{/* <span className="block text-sm font-medium text-slate-700">Rechercher</span> */}
				<input
					type={'text'}
					inputMode="search"
					{...register('search')}
					name={'search'}
					className={twMerge(className.input)}
					placeholder={'trouver une annonce'}
					defaultValue={filtParams?.text}
				/>
			</div>
			<div className=" ">
				{/* <span className="block text-sm font-medium text-slate-700">Prix</span> */}
				<div className="flex gap-2">
					<input
						type={'number'}
						inputMode="numeric"
						{...register('price_min', { valueAsNumber: true })}
						name={'price_min'}
						className={twMerge(className.input, 'w-1/4')}
						placeholder={'Prix min'}
						defaultValue={filtParams?.price?.[0]}
					/>
					<input
							type={'number'}
						inputMode="numeric"
						{...register('price_max', { valueAsNumber: true })}
						name={'price_max'}
						className={twMerge(className.input, 'w-1/4')}
						placeholder={'Prix max'}
						defaultValue={filtParams?.price?.[1]}
					/>
				</div>
			</div>

			<div className={twMerge('w-1/5')}>
				{/* <span className=" text-sm font-medium text-slate-700 ">{'Classer par :'}</span> */}
				<Select
					name="order"
					defaultValue={getKeyByValue(filt, filtParams?.order_by) || Object.keys(filt)[0]}
					onValueChange={(value) => {
						//@ts-expect-error value is string
						setOrderBy(value);
					}}
				>
					<SelectTrigger className={twMerge(className.input)}>
						<SelectValue placeholder={Object.keys(filt)[0]} />
					</SelectTrigger>
					<SelectContent className="bg-white">
						{Object.keys(filt).map((value) => (
							<SelectItem className="font-poppins focus:bg-primary" key={value} value={String(value)}>
								{value}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
