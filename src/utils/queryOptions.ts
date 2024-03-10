import { createDiscussion } from './../services/api/discussions';
import {
	addFavouriteProduct,
	createProduct,
	deleteFavouriteProduct,
	deleteProduct,
	getAllChildCategories,
	getFavouriteProduct,
	getFavouriteProductsId,
	getProduct,
	getProducts,
	getProductsByFiltr,
	reportProduct,
	updateProduct,
} from './../services/api/product_categorie';
import { z } from 'zod';
import { getAcount } from '@/services/api/user';
import { keepPreviousData, queryOptions, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/route';
import { ToastError, ToastSuccess } from '@/lib/utils';
import { getDiscussions, sendMessage } from '@/services/api/discussions';
export const LIMIT_PRODUCT_PAGE = 3;
//user
export function accountQueryOptions(accountId: string) {
	return queryOptions({
		queryKey: ['account', accountId],
		queryFn: () => getAcount({ accountId }),
	});
}

export const getAllChildCategoriesOptions = () => {
	return queryOptions({
		queryKey: ['AllChildCategories'],
		queryFn: getAllChildCategories,
		gcTime: Infinity,
		staleTime: Infinity,
	});
};

export function useCreateProductMutation() {
	return useMutation({
		mutationKey: ['createProduct'],
		mutationFn: createProduct,
		onSuccess: () => {},
		onError: () => {
			ToastError('Une erreur est survenue lors de la création du produit');
		},
	});
}

export function useDeleteProductMutation() {
	return useMutation({
		mutationFn: deleteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['productsByfiltr'] });
			ToastSuccess("L'annonce a bien été supprimée");
		},
		onError: () => {
			ToastError("L'annonce n'a pas pu être supprimée");
		},
	});
}

const OrderBy = z.enum(['date_desc', 'date_asc', 'price_desc', 'price_asc']);

const FilterSchema = z.object({
	category_id: z.string().optional(),
	order_by: OrderBy.optional(),
	text: z.string().optional(),
	price: z.tuple([z.number(), z.number()]).optional(),
});
const FilterProductSchema = z.object({
	category_id: z.string(),
	order_by: OrderBy.optional(),
	text: z.string().optional(),
	price: z.tuple([z.number(), z.number()]).optional(),
});

export const RequestDataSchema = z.object({
	provider_id: z.string(),
	page: z.number().optional(),
	// limit: z.number().optional(),
	filter: FilterSchema.optional(),
});

export type RequestDataType = z.infer<typeof RequestDataSchema>;

export const RequestFilterProductSchema = z.object({
	// limit: z.number().default(),
	page: z.number().optional(),
	filter: FilterProductSchema,
});

export type RequestFilterProductType = z.infer<typeof RequestFilterProductSchema>;

export function getProductsOptions(RequestData: RequestFilterProductType) {
	return queryOptions({
		queryKey: ['products', RequestData],
		queryFn: () => getProducts(RequestData),
		placeholderData: keepPreviousData,
	});
}

export function getProductsByfiltrOptions(Requestfiltre: RequestDataType) {
	return queryOptions({
		queryKey: ['productsByfiltr', Requestfiltre],
		queryFn: () => getProductsByFiltr(Requestfiltre),
		placeholderData: keepPreviousData,
	});
}

export function getProductOptions(id: string) {
	return queryOptions({
		queryKey: ['product', id],
		queryFn: () => getProduct(id),
	});
}

export function useUpdateMutationproduct() {
	return useMutation({
		mutationFn: updateProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['productsByfiltr'] });
			queryClient.invalidateQueries({ queryKey: ['getAllFavouriteProductIds'] });
			ToastSuccess('Annonce modifie avec success');
		},
	});
}

///****FAVOURITE PRODUCT */

export function getAllFavouriteProductIds() {
	return queryOptions({
		queryKey: ['getAllFavouriteProductIds'],
		queryFn: getFavouriteProductsId,
		gcTime: Infinity,
		staleTime: Infinity,
	});
}

export function useAddProductFavouriteMutation() {
	return useMutation({
		mutationFn: addFavouriteProduct,
		onMutate: async (newId) => {
			await queryClient.cancelQueries({ queryKey: ['getAllFavouriteProductIds'] });
			const previousIds = (queryClient.getQueryData(['getAllFavouriteProductIds']) as string[]) || [];
			queryClient.setQueryData(['getAllFavouriteProductIds'], (old: string[]) => {
				if (!old) return [newId];
				return [...old, newId];
			});
			return { previousIds };
		},
		onError: (_err, _newId, context) => {
			queryClient.setQueryData(['getAllFavouriteProductIds'], context?.previousIds);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['getAllFavouriteProductIds'] });
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getAllFavouriteProductIds'] });
			ToastSuccess('Annonce ajoute au favoris');
		},
	});
}

export function useDeleteProductFavouriteMutation() {
	return useMutation({
		mutationFn: deleteFavouriteProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getAllFavouriteProductIds'] });
			ToastSuccess('Annonce supprime des favoris');
		},
		onMutate: async (newId) => {
			await queryClient.cancelQueries({ queryKey: ['getAllFavouriteProductIds'] });
			const previousIds = (queryClient.getQueryData(['getAllFavouriteProductIds']) as string[]) || [];
			queryClient.setQueryData(['getAllFavouriteProductIds'], (old: string[]) => {
				if (!old) return [newId];
				return old.filter((id) => id !== newId);
			});
			return { previousIds };
		},
		onError: (_err, _newId, context) => {
			queryClient.setQueryData(['getAllFavouriteProductIds'], context?.previousIds);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['getAllFavouriteProductIds'] });
			queryClient.invalidateQueries({ queryKey: ['getFavouriteProduct'] });
		},
	});
}

export function getOptionsFavouriteProduct(paginate: { page: number }) {
	return queryOptions({
		queryKey: ['getFavouriteProduct', paginate],
		queryFn: () => getFavouriteProduct(paginate),
		placeholderData: keepPreviousData,
	});
}

//*****REPORT PRODUCT */

export function useReportProductMutation() {
	return useMutation({
		mutationFn: reportProduct,
		onSuccess: () => {
			ToastSuccess('Merci pour votre aide');
		},
		onError: (err) => {
			ToastError(err.message);
		},
	});
}

//*****DISCUSSIONS */

export function useSendMessageMutation() {
	return useMutation({
		mutationFn: sendMessage,

		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ['getMessages', data?.discussion_id] });
			ToastSuccess('ok');
		},
		onError: () => {
			ToastError("Une erreur est survenue lors de l'envoi du message");
		},
	});
}

export function useCreateDiscussionMutaton() {
	return useMutation({
		mutationFn: createDiscussion,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getDiscussions'] });
			ToastSuccess('ok');
		},
		onError: (err) => {
			console.log(err);
			ToastError('Une erreur est survenue lors de la création de la discussion');
		},
	});
}

export function getDiscussionsQueryOptions() {
	return queryOptions({
		queryKey: ['getDiscussions'],
		queryFn: getDiscussions,
		placeholderData: keepPreviousData,
	});
}

// export function getMessagesQueryOptions({ page = 1}) {
// 	return queryOptions({
// 		queryKey: ['getMessages', {page}],
// 		queryFn: () => getMessages({ page}),
// 		initi

// 		placeholderData: keepPreviousData,
// 	});
// }
