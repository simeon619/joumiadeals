import HomePage from '@/pages/index/HomePage';
import AuthLayout from '@/pages/_layout/AuthLayout';
import IndexLayout from '@/pages/_layout/IndexLayout';
import ProfileLayout from '@/pages/_layout/ProfileLayout';
import ProfilePage from '@/pages/profile/ProfilePage';
import RegisterPage from '@/pages/auth/RegisterPage';
// import { useAuth } from '@/services/state/User/auth';
// import {z} from "zod"
import { 
	createRoute,
	createRouter,
	// redirect,
} from '@tanstack/react-router';
import {
	Outlet,
	createRootRoute,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import LoginPage from '@/pages/auth/LoginPage';
// import { RootRoute, Outlet, Route } from "@tanstack/react-router";
const rootRoute = createRootRoute({
	component: () => (
		<div>
			<Outlet />
			<TanStackRouterDevtools position="bottom-right" />
		</div>
	),
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
// const dataUserParams = z.object({
// 	page: z.string(),
// 	phone: z.string(),
// 	name: z.string(),
// 	avatarUrl: z.string(),
// 	auth_client_id: z.string(),
// 	auth_provider_name : z.string(),
// })

const profileLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: 'profile',
	component: ProfileLayout,
	// 	beforeLoad: ({ location,navigate }) => {
	// 	if (!useAuth.getState().isAuth) {
	// 		throw redirect({
	// 			to: registerRoot.to,
	// 			search: {  	 },
	// 			mask : "/register",
	// 			replace: true,
	// 		});
	// 	} else {
	// 		navigate({
	// 			to : profileRoot.to,
	// 			replace :true,
	// 			mask : "/profile"
	// 		})
	// 	}
	// }  
});



export const loginRoot = createRoute({
	getParentRoute: () => authLayout,
	path: 'login',
	component: LoginPage
});


export const registerRoot = createRoute({
	getParentRoute: () => authLayout,
	path: 'register',
	component: RegisterPage,
});

export const profileRoot = createRoute({
	getParentRoute: () => profileLayout,
	path: '/profile',
	component: ProfilePage,
});

const homeRoot = createRoute({
	getParentRoute: () => indexLayout,
	path: '/',
	component: () => <HomePage />,
});

const routeTree = rootRoute.addChildren([
	indexLayout.addChildren([homeRoot]),
	authLayout.addChildren([registerRoot, loginRoot]),
	profileLayout.addChildren([profileRoot]),
]);

export const router = createRouter({
	routeTree,
	// defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
