import HomePage from '@/pages/index/HomePage';
import AuthLayout from '@/pages/_layout/AuthLayout';
import IndexLayout from '@/pages/_layout/IndexLayout';
import ProfileLayout from '@/pages/_layout/ProfileLayout';
import RegisterPage from '@/pages/auth/RegisterPage';
// import { useAuth } from '@/services/state/User/auth';
import {
	ErrorComponent,
	createRootRouteWithContext,
	createRoute,
	createRouter,
	ScrollRestoration,
} from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import LoginPage from '@/pages/auth/LoginPage';
import MyprofilePage from '@/pages/profile/index/MyprofilePage';
import { QueryClient } from '@tanstack/react-query';
import ProductsPage from '@/pages/index/ProductsPage';
import ProductDetailsPage from '@/pages/index/ProductDetailsPage';
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
	getProductsByfiltrOptions,
	getProductsOptions,
} from '@/utils/queryOptions';
import CreateProduct from '@/pages/index/CreateProduct';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserType, useAuth } from '@/services/state/User/auth';
import ProfilePage from '@/pages/profile/index/ProfilePage';
import Myannounce from '@/pages/profile/Myannounce';
import MyFavourite from '@/pages/profile/MyFavourite';
import { pageSchema } from '@/services/api/product_categorie';
import { Suspense, useRef, useState } from 'react';
import Discussion from '@/pages/profile/Discussion';
import { z } from 'zod';
import RootPage from '@/components/root/RootPage';
// import { getDiscussions } from '@/services/api/discussions';
const rootRoute = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	component:  RootPage,
	beforeLoad() {
		useAuth.getState().verifToken();
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

const profileLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: 'profile',
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

export const myprofileRoot = createRoute({
	getParentRoute: () => profileLayout,
	path: '/myprofile',
	component: MyprofilePage,
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
		opts.context.queryClient.ensureQueryData(getProductsByfiltrOptions(opts.deps));
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
});
export const visitedRoot = createRoute({
	getParentRoute: () => myprofileRoot,
	path: 'historique',
	component: () => <div>historique</div>,
});
export const discussionSchema = z.object({ discussionId: z.string().optional() });

export const discussionRoot = createRoute({
	getParentRoute: () => indexLayout,
	path: 'discussion',
	component: Discussion,
	// parseParams: (params) => ({
	// 	discussionId: z.string().optional().parse(params),
	// }),
	validateSearch: (params) => discussionSchema.parse(params),
	// loaderDeps: ({ search: { } }) => ({ page , limit }),
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(getDiscussionsQueryOptions()),
});

const homeRoot = createRoute({
	getParentRoute: () => indexLayout,
	path: '/',
	component: HomePage,
});
export const profileRoot = createRoute({
	getParentRoute: () => profileLayout,
	path: 'otherProfile',
	validateSearch: (params) => RequestDataSchema.parse(params),
	loaderDeps: ({ search: { provider_id, filter, page } }) => ({
		provider_id,
		filter,
		page,
	}),
	loader: (opts) => {
		opts.context.queryClient.ensureQueryData(getProductsByfiltrOptions(opts.deps));
		// opts.context.queryClient.ensureQueryData(getAllFavouriteProductIds());
		opts.context.queryClient.ensureQueryData(accountQueryOptions(opts.deps.provider_id));
	},
	wrapInSuspense: true,
	// parseParams: (params) => ({
	// 	profileId: z.string().parse(String(params.profileId)),
	// }),
	// errorComponent: () => <h1>TODO IMPLEMENT COMPONENT ERREUR</h1>,
	// loader: ({ context: { queryClient }, params: { profileId } }) =>
	// 	queryClient.ensureQueryData(accountQueryOptions(profileId)),

	component: ProfilePage,
});

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
	indexLayout.addChildren([
		homeRoot,
		profileRoot,
		productsRoot,
		productDetailsRoot,
		createProductRoot,
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
