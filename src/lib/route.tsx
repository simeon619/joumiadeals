import HomePage from '@/pages/index/HomePage';
import AuthLayout from '@/pages/_layout/AuthLayout';
import IndexLayout from '@/pages/_layout/IndexLayout';
import ProfileLayout from '@/pages/_layout/ProfileLayout';
import ProfilePage from '@/pages/profile/ProfilePage';
import RegisterPage from '@/pages/auth/RegisterPage';
// import { useAuth } from '@/services/state/User/auth';
// import { z } from 'zod';
import {
	ErrorComponent,
	createRootRouteWithContext,
	createRoute,
	createRouter,
	ScrollRestoration,
} from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import LoginPage from '@/pages/auth/LoginPage';
import MyprofilePage from '@/pages/profile/MyprofilePage';
import { QueryClient } from '@tanstack/react-query';
import ProductsPage from '@/pages/index/ProductsPage';
import ProductDetailsPage from '@/pages/index/ProductDetailsPage';
import { accountQueryOptions, getAllChildCategoriesOptions } from '@/utils/queryOptions';
import CreateProduct from '@/pages/index/CreateProduct';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuth } from '@/services/state/User/auth';
const rootRoute = createRootRouteWithContext<{
	queryClient: QueryClient;
}>()({
	component: () => (
		<>
			<ScrollRestoration  getKey={(location) => location.pathname}/>
			<Outlet />
			{/* <TanStackRouterDevtools position="bottom-right" /> */}
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	),
	beforeLoad() {
		useAuth.getState().verifToken()
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
	path: 'login',
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
	component: () => <div>announce</div>,
});
export const favouriteRoot = createRoute({
	getParentRoute: () => myprofileRoot,
	path: 'favourite',
	component: () => <div>favourite</div>,
});
export const visitedRoot = createRoute({
	getParentRoute: () => myprofileRoot,
	path: 'historique',
	component: () => <div>historique</div>,
});

export const report = createRoute({
	getParentRoute: () => myprofileRoot,
	path: 'report',
	component: () => <div>report</div>,
});

const homeRoot = createRoute({
	getParentRoute: () => indexLayout,
	path: '/',
	component: HomePage,
});
export const profileRoot = createRoute({
	getParentRoute: () => indexLayout,
	path: 'profile/$profileId',
	// parseParams: (params) => ({
	// 	profileId: z.string().parse(String(params.profileId)),
	// }),
	errorComponent: () => <h1>TODO IMPLEMENT COMPONENT ERREUR</h1>,
	loader: ({ context: { queryClient }, params: { profileId } }) =>
		queryClient.ensureQueryData(accountQueryOptions(profileId)),
	component: ProfilePage,
});

export const productsRoot = createRoute({
	getParentRoute: () => indexLayout,
	path: 'products',
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
	errorComponent: () => <h1>TODO IMPLEMENT COMPONENT ERREUR : product don&apos;t exist</h1>,
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
		myprofileRoot.addChildren([announceRoot, visitedRoot, favouriteRoot, report]),
	]),
]);

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});
export const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
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
