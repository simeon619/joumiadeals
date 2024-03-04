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
import React, { useMemo, useState } from 'react';
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
		// e.stopPropagation();
	};
	const fnDeleteFavourite = (e: any) => {
		e.preventDefault();
		deleteProductFavourite.mutate(productId);
	};
	useMemo(() => {
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
			className={twMerge(style)}
			onClick={(e) => {
				isFavourite ? fnDeleteFavourite(e) : fnAddFavourite(e);
			}}
		>
			<Heart fill={isFavourite ? 'orange' : 'transparent'} color={isFavourite ? 'orange' : 'gray'} />
		</button>
	);
}
