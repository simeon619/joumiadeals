import { createProduct, getAllChildCategories } from './../services/api/product_categorie';
import { getAcount } from '@/services/api/user';
import { queryOptions, useMutation } from '@tanstack/react-query';

//user
export function accountQueryOptions(accountId: string) {
	return queryOptions({
		queryKey: ['account', accountId],
		queryFn: () => getAcount({ accountId }),
	});
}

export const getAllChildCategoriesOptions = () => {
	return queryOptions({ queryKey: ['AllChildCategories'], queryFn: getAllChildCategories });
};

export function useCreateProductMutation() {
	return useMutation({ mutationKey: ['createProduct'], mutationFn: createProduct });
}
