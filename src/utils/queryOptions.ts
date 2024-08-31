/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryClient } from '@/lib/route';
import { ToastError, ToastSuccess } from '@/lib/utils';
import {
	checkAllUnreadMessages,
	checkUnreadMessages,
	FilterDiscussionType,
	getDiscussions,
	getMessages,
	markAsRead,
	sendMessage,
} from '@/services/api/discussions';
import { getAcount, getMyLike, toggleLike } from '@/services/api/user';
import { useAuth } from '@/services/state/User/auth';
import { keepPreviousData, queryOptions, useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { createDiscussion } from './../services/api/discussions';
import {
	addFavouriteProduct,
	addVisitedProduct,
	createProduct,
	deleteFavouriteProduct,
	deleteProduct,
	get_feature_values_product,
	getAllChildCategories,
	getAllFeatures,
	getFavouriteProduct,
	getFavouriteProductsId,
	getFeaturesCategory,
	getProduct,
	getProducts,
	getVisitedProducts,
	reportProduct,
	updateProduct,
	updateProductStatus,
} from './../services/api/product_categorie';
export const LIMIT_PRODUCT_PAGE = 7;

export function accountQueryOptions(accountId: number) {
	return queryOptions({
		queryKey: ['account', accountId],
		queryFn: () => getAcount({ accountId }),
		enabled: Boolean(accountId),
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
export function getAllfeaturesOptions() {
	return queryOptions({
		queryKey: ['Allfeatures'],
		queryFn: getAllFeatures,
		gcTime: Infinity,
		staleTime: Infinity,
	});
}
export function getFeaturesCategoryOptions(category_id: string) {
	return queryOptions({
		queryKey: ['features', category_id],
		queryFn: () => getFeaturesCategory({ category_id }),
		// enabled: Boolean(category_id),
		placeholderData: keepPreviousData,
	});
}
export function useCreateProductMutation() {
	return useMutation({
		mutationKey: ['createProduct'],
		mutationFn: createProduct,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['products'] });
			ToastSuccess('Le produit a bien été crée');
		},
		onError: (e) => {
			ToastError('Une erreur est survenue lors de la création du produit');
			ToastError(e.message);
		},
	});
}

export function getFeatureProductOptions(product_id: string | undefined) {
	return queryOptions({
		queryKey: ['featuresValues', product_id],
		queryFn: () => get_feature_values_product({ product_id }),
		enabled: Boolean(product_id),
		placeholderData: keepPreviousData,
	});
}
export function useDeleteProductMutation() {
	return useMutation({
		mutationFn: deleteProduct,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['products'] });
			ToastSuccess("L'annonce a bien été supprimée");
		},
		onError: () => {
			ToastError("L'annonce n'a pas pu être supprimée");
		},
	});
}

const OrderBy = z.enum(['date_desc', 'date_asc', 'price_desc', 'price_asc']);

// const FilterProductSchema = z.object({
// 	category_id: z.string(),
// 	order_by: OrderBy.optional(),
// 	text: z.string().optional(),
// 	status: z.array(z.string()),
// 	features: z
// 		.array(
// 			z.object({
// 				feature_id: z.string(),
// 				value: z.union([z.string().nullable(), z.array(z.number().nullable())]).optional(),
// 			})
// 		)
// 		.optional(),
// 	price: z.tuple([z.number().nullable(), z.number().nullable()]).optional(),
// });
const FilterSchema = z.object({
	category_id: z.string().optional(),
	order_by: OrderBy.optional(),
	text: z.string().optional(),
	price: z.tuple([z.number().nullable(), z.number().nullable()]).optional(),
	status: z.number(),
	features: z.record(z.union([z.string(), z.array(z.union([z.string(), z.number()]))])).optional(),
	// features: z
	// 	.object({
	// 		feature_id: z.string(),
	// 		value: z.union([z.string().nullable(), z.array(z.number().nullable())]).optional(),
	// 	})
	// 	.optional(),
});

export type FilterProductType = z.infer<typeof FilterSchema>;

export const RequestDataSchema = z.object({
	provider_id: z.number(),
	page: z.number().optional(),
	filter: FilterSchema,
});

export type RequestDataType = z.infer<typeof RequestDataSchema>;
export const RequestFilterProductSchema = z.object({
	// limit: z.number().default(),
	page: z.number().optional(),
	filter: FilterSchema,
});

export type RequestFilterProductType = z.infer<typeof RequestFilterProductSchema>;

export function getProductsOptions(RequestData: RequestFilterProductType) {
	return queryOptions({
		queryKey: ['products', RequestData],
		queryFn: () => getProducts(RequestData),
		placeholderData: keepPreviousData,
	});
}
export function useUpdateMutationproductStatus() {
	return useMutation({
		mutationFn: updateProductStatus,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['products'] });
			// ToastSuccess('Annonce modifie avec success');
		},
	});
}

export function getProductOptions(id: string) {
	return queryOptions({
		queryKey: ['product', id],
		queryFn: () => getProduct(id),
	});
}

export function getAllFavouriteProductIds() {
	return queryOptions({
		queryKey: ['getAllFavouriteProductIds'],
		queryFn: getFavouriteProductsId,
		gcTime: Infinity,
		staleTime: Infinity,
		placeholderData: keepPreviousData,
		enabled: useAuth.getState().isAuth,
	});
}
///****FAVOURITE PRODUCT */
export function useUpdateMutationproduct() {
	return useMutation({
		mutationFn: updateProduct,
		onSuccess: async (data, { dataProduct }) => {
			await queryClient.invalidateQueries({ queryKey: ['products'] });
			await queryClient.invalidateQueries({ queryKey: ['featuresValues', dataProduct.product_id] });
			ToastSuccess('Annonce modifie avec success');
		},
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
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ['getAllFavouriteProductIds'] });
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['getAllFavouriteProductIds'] });
			ToastSuccess('Annonce ajoute au favoris');
		},
	});
}

export function useDeleteProductFavouriteMutation() {
	return useMutation({
		mutationFn: deleteFavouriteProduct,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['getAllFavouriteProductIds'] });
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
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: ['getAllFavouriteProductIds'] });
			await queryClient.invalidateQueries({ queryKey: ['getFavouriteProduct'] });
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

//*****LIKES */

export function getLikeOptions(data: { id: any; type: 'account' | 'message' }) {
	return queryOptions({
		queryKey: ['getLike', data],
		queryFn: () => getMyLike(data),
		placeholderData: keepPreviousData,
		enabled: useAuth.getState().isAuth,
	});
}
export function useToggleLikeMutation() {
	return useMutation({
		mutationFn: toggleLike,
		onSuccess: (data, { id, type, value }) => {
			queryClient.invalidateQueries({ queryKey: ['getLike', { id, type }] });
		},
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

export function getAllUnreadMessagesOptions() {
	return queryOptions({
		queryKey: ['getAllUnreadMessages'],
		queryFn: () => checkAllUnreadMessages(),
		enabled: useAuth.getState().isAuth,
	});
}

export function getUnreadMessagesOptions(discussion_id: number) {
	return queryOptions({
		queryKey: ['getUnreadMessages', discussion_id],
		queryFn: () => checkUnreadMessages(discussion_id),
		// enabled: useAuth.getState().isAuth,
	});
}
export function useMarkAsReadMutation() {
	return useMutation({
		mutationFn: markAsRead,
		onSuccess: async (data, variables) => {
			await queryClient.invalidateQueries({ queryKey: ['getUnreadMessages', variables] });
			await queryClient.invalidateQueries({ queryKey: ['getAllUnreadMessages'] });
		},
		onError: (err) => {
			ToastError(err.message);
		},
	});
}
export function useSendMessageMutation() {
	return useMutation({
		mutationFn: sendMessage,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['getDiscussions'] });
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
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['getDiscussions'] });
			ToastSuccess('ok');
		},
		onError: (err) => {
			console.log(err);
			ToastError('Une erreur est survenue lors de la création de la discussion');
			ToastError(err.message);
		},
	});
}

export function getDiscussionsQueryOptions(requestDiscussion: FilterDiscussionType) {
	return queryOptions({
		queryKey: ['getDiscussions', requestDiscussion],
		queryFn: () => getDiscussions(requestDiscussion),
		placeholderData: keepPreviousData,
	});
}

export function getMessagesQueryOptions({
	page = 1,
	discussion_id,
}: {
	page?: number;
	discussion_id: number | undefined;
}) {
	return queryOptions({
		queryKey: ['getMessages', { page, discussion_id }],
		queryFn: () => getMessages({ page, discussion_id }),
		placeholderData: keepPreviousData,
	});
}

///****VISITED PRODUCT */
export function useAddVisitedProductMutation() {
	return useMutation({
		mutationFn: addVisitedProduct,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ['getVisitedProducts'] });
			ToastSuccess('Annonce ajoute au favoris');
		},
	});
}

export function getVisitedProductsOptions({ page }: { page: number }) {
	return queryOptions({
		queryKey: ['getVisitedProducts', page],
		queryFn: () => getVisitedProducts({ page }),
		staleTime: Infinity,
		placeholderData: keepPreviousData,
		enabled: useAuth.getState().isAuth,
	});
}
