import Header from '@/components/root/Header';
import { Outlet, createRootRoute } from '@tanstack/react-router';
// import { TanStackRouterDevtools } from '@tanstack/router-devtools';
export const Route = createRootRoute({
	component: RootComponent,
});
// md:2/5 w-full lg:w-4/6
function RootComponent() {
	return (
		<div className="flex justify-center">
			<div className="max-w-7xl">
				<Header />
				<hr />
				<Outlet />
				{/* <TanStackRouterDevtools position="bottom-right" /> */}
			</div>
		</div>
	);
}
