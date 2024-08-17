import AuthLayout from '@/pages/_layout/AuthLayout';
import IndexLayout from '@/pages/_layout/IndexLayout';
import ProfileLayout from '@/pages/_layout/ProfileLayout';
import RegisterPage from '@/pages/auth/RegisterPage';
import HomePage from '@/pages/index/HomePage';
// import { useAuth } from '@/services/state/User/auth';
import RootPage from '@/components/root/RootPage';
import LoginPage from '@/pages/auth/LoginPage';
import CreateProduct from '@/pages/index/CreateProduct';
import ProductDetailsPage from '@/pages/index/ProductDetailsPage';
import ProductsPage from '@/pages/index/ProductsPage';
import AvisPage from '@/pages/profile/AvisPage';
import Discussion from '@/pages/profile/Discussion';
import MyprofilePage from '@/pages/profile/index/MyprofilePage';
import ProfilePage from '@/pages/profile/index/ProfilePage';
import Myannounce from '@/pages/profile/Myannounce';
import MyFavourite from '@/pages/profile/MyFavourite';
import OtherAnnouncePage from '@/pages/profile/OtherAnnouncePage';
import { FilterDiscussionSchema } from '@/services/api/discussions';
import { pageSchema } from '@/services/api/product_categorie';
import { UserType, useAuth } from '@/services/state/User/auth';

import {
	RequestDataSchema,
	RequestFilterProductSchema,
	accountQueryOptions,
	getAllChildCategoriesOptions,
	getAllFavouriteProductIds,
	getDiscussionsQueryOptions,
	// getMessagesQueryOptions,
	getOptionsFavouriteProduct,
	getProductOptions,
	// getProductsByfiltrOptions,
	getProductsOptions,
	getVisitedProductsOptions,
} from '@/utils/queryOptions';
import { QueryClient } from '@tanstack/react-query';
import {
	ErrorComponent,
	createRootRouteWithContext,
	createRoute,
	createRouter,
} from '@tanstack/react-router';
import { z } from 'zod';
import { initTransmit } from './transmit';
import HistorisquePage from '@/pages/profile/HistorisquePage';
// import { getDiscussions } from '@/services/api/discussions';
const rootRoute = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	component: RootPage,
	beforeLoad() {
		useAuth.getState().verifToken();
		initTransmit();
		//@ts-expect-error dert
		addEventListener('iui', (event: { detail: UserType }) => {
			useAuth.getState().login(event.detail);
		});
	},
});

const authLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: 'auth',
	component: AuthLayout,
});

const indexLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: 'index',
	component: IndexLayout,
});
//  const otherProfileLayout = createRoute({
// 	getParentRoute: () => rootRoute,
// 	id: 'otherProfile',
// 	// parseParams: (params) => ({
// 	// 	profileId: z.string().parse(String(params.profileId)),
// 	// }),
// 	// errorComponent: () => <h1>TODO IMPLEMENT COMPONENT ERREUR</h1>,
// 	// loader: ({ context: { queryClient }, params: { profileId } }) =>
// 	// 	queryClient.ensureQueryData(accountQueryOptions(profileId)),
// 	component: ProfilePage,
// });
const profileLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: 'profile',
	component: ProfileLayout,
	wrapInSuspense: true,
});
const otherProfileLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: 'otherProfile',
	component: ProfileLayout,
});
export const loginRoot = createRoute({
	getParentRoute: () => authLayout,
	path: 'connexion',
	component: LoginPage,
});

export const registerRoot = createRoute({
	getParentRoute: () => authLayout,
	path: 'register',
	component: RegisterPage,
});

export const announceRoot = createRoute({
	getParentRoute: () => myprofileRoot,
	path: '/',
	validateSearch: (params) => RequestDataSchema.parse(params),
	// preSearchFilters: [(search)=>({...search,filter:{...search.filter, text: undefined}})],
	loaderDeps: ({ search: { provider_id, filter, page } }) => ({
		provider_id,
		filter,
		page,
	}),
	loader: (opts) => {
		opts.context.queryClient.ensureQueryData(getProductsOptions(opts.deps));
		opts.context.queryClient.ensureQueryData(getAllFavouriteProductIds());
	},
	wrapInSuspense: true,
	component: Myannounce,
	// errorComponent: () => <h1>TODO IMPLEMENT COMPONENT ERREUR</h1>,
	// shouldReload: true,
});

export const favouriteRoot = createRoute({
	getParentRoute: () => myprofileRoot,
	path: 'favourite',
	validateSearch: (params) => pageSchema.parse(params),
	loaderDeps: ({ search: { page } }) => ({ page }),
	loader: ({ context: { queryClient }, deps: { page } }) =>
		queryClient.ensureQueryData(getOptionsFavouriteProduct({ page })),
	component: MyFavourite,
	wrapInSuspense: true,
});
export const visitedRoot = createRoute({
	getParentRoute: () => myprofileRoot,
	path: 'historique',
	validateSearch: (params) => pageSchema.parse(params),
	loaderDeps: ({ search: { page } }) => ({ page }),
	loader: ({ context: { queryClient }, deps: { page } }) =>
		queryClient.ensureQueryData(getVisitedProductsOptions({ page })),
	component: HistorisquePage,
	wrapInSuspense: true,
});
export const discussionSchema = z.object({ discussionId: z.string().optional() });

export const discussionRoot = createRoute({
	getParentRoute: () => indexLayout,
	path: 'discussion',
	component: Discussion,
	// parseParams: (params) => ({
	// 	productId: z.any().optional().parse(params),
	// }),
	validateSearch: (params) => FilterDiscussionSchema.parse(params),
	loaderDeps: ({ search: { filter, page, product_id, provider_id } }) => ({
		page,
		filter,
		product_id,
		provider_id,
	}),
	loader: ({ context: { queryClient }, deps: { filter, page, product_id, provider_id } }) =>
		queryClient.ensureQueryData(
			getDiscussionsQueryOptions({ filter, page, product_id, provider_id })
		),
});

const homeRoot = createRoute({
	getParentRoute: () => indexLayout,
	path: '/',
	component: HomePage,
});
export const myprofileRoot = createRoute({
	getParentRoute: () => profileLayout,
	path: '/myprofile',
	component: MyprofilePage,
	wrapInSuspense: true,
});

export const profileOtherRoot = createRoute({
	getParentRoute: () => otherProfileLayout,
	path: 'o_profile',
	wrapInSuspense: true,
	component: ProfilePage,
	// errorComponent: () => <h1>TODO IMPLEMENT COMPONENT ERREUR</h1>,
	// shouldReload: true,
});

export const productsOtherRoot = createRoute({
	getParentRoute: () => profileOtherRoot,
	path: 'announceOther',
	validateSearch: (params) => RequestDataSchema.parse(params),
	loaderDeps: ({ search: { provider_id, filter, page } }) => ({
		provider_id,
		filter,
		page,
	}),
	loader: (opts) => {
		opts.context.queryClient.ensureQueryData(getProductsOptions(opts.deps));
		// opts.context.queryClient.ensureQueryData(getAllFavouriteProductIds());
		opts.context.queryClient.ensureQueryData(accountQueryOptions(opts.deps.provider_id));
	},
	wrapInSuspense: true,
	component: OtherAnnouncePage,
	// errorComponent: () => <h1>TODO IMPLEMENT COMPONENT ERREUR</h1>,
});

export const noticesAccountRoot = createRoute({
	getParentRoute: () => profileOtherRoot,
	path: 'notices',
	validateSearch: (params) => FilterDiscussionSchema.parse(params),
	loaderDeps: ({ search: { filter, page, provider_id } }) => ({ page, filter, provider_id }),
	loader: ({ context: { queryClient }, deps: { filter, page, provider_id } }) =>
		queryClient.ensureQueryData(getDiscussionsQueryOptions({ filter, page, provider_id })),
	component: AvisPage,
});

// export const comments

export const productsRoot = createRoute({
	getParentRoute: () => indexLayout,
	validateSearch: (params) => RequestFilterProductSchema.parse(params),
	loaderDeps: ({ search: { filter, page } }) => ({
		filter,
		page,
	}),
	path: 'products',
	loader: (opts) => {
		opts.context.queryClient.ensureQueryData(getProductsOptions(opts.deps));
		opts.context.queryClient.ensureQueryData(getAllFavouriteProductIds());
	},
	wrapInSuspense: true,
	component: ProductsPage,
});

export const createProductRoot = createRoute({
	getParentRoute: () => indexLayout,
	path: 'creation_annonce',
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(getAllChildCategoriesOptions()),
	component: CreateProduct,
});

export const productDetailsRoot = createRoute({
	getParentRoute: () => indexLayout,
	path: 'product/$productId',
	parseParams: (params) => ({
		productId: params.productId,
	}),
	loader: ({ context: { queryClient }, params: { productId } }) =>
		queryClient.ensureQueryData(getProductOptions(productId)),
	component: ProductDetailsPage,
});
const routeTree = rootRoute.addChildren([
	indexLayout.addChildren([homeRoot, productsRoot, productDetailsRoot, createProductRoot]),
	otherProfileLayout.addChildren([
		profileOtherRoot.addChildren([productsOtherRoot, noticesAccountRoot]),
	]),
	authLayout.addChildren([registerRoot, loginRoot]),
	profileLayout.addChildren([
		myprofileRoot.addChildren([announceRoot, visitedRoot, favouriteRoot, discussionRoot]),
	]),
]);

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 2,
			refetchOnWindowFocus: false,
		},
	},
});
export const router = createRouter({
	routeTree,
	// defaultPreload: 'intent',
	defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
	context: {
		queryClient,
	},
	defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
