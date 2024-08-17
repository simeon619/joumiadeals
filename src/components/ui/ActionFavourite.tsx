/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { queryClient } from '@/lib/route';
import {
	getAllFavouriteProductIds,
	useAddProductFavouriteMutation,
	useDeleteProductFavouriteMutation,
} from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export default function ActionFavourite({
	productId,
	style,
}: {
	productId: string;
	style?: string;
}) {
	const deleteProductFavourite = useDeleteProductFavouriteMutation();
	const { data: favouriteIds } = useSuspenseQuery(getAllFavouriteProductIds());
	const [isFavourite, setIsFavourite] = useState(false);
	const addProductFavourite = useAddProductFavouriteMutation();
	const fnAddFavourite = (e: any) => {
		e.preventDefault();
		addProductFavourite.mutate(productId);
	};
	const fnDeleteFavourite = (e: any) => {
		e.preventDefault();
		deleteProductFavourite.mutate(productId);
	};
	useEffect(() => {
		const favourites = (queryClient.getQueryData(['getAllFavouriteProductIds']) as string[]) || [];
		if (favourites.includes(productId)) {
			setIsFavourite(true);
		} else {
			setIsFavourite(false);
		}
	}, [
		addProductFavourite.isSuccess,
		addProductFavourite.isPending,
		addProductFavourite.isError,
		deleteProductFavourite.isSuccess,
		deleteProductFavourite.isPending,
		deleteProductFavourite.isError,
		favouriteIds,
	]);
	return (
		<button
			className={twMerge(style, 'p-1 bg-white border rounded-full')}
			onClick={(e) => {
				isFavourite ? fnDeleteFavourite(e) : fnAddFavourite(e);
			}}
		>
			<Heart size={18} fill={isFavourite ? 'red' : 'white'} color={isFavourite ? 'red' : 'gray'} />
		</button>
	);
}
