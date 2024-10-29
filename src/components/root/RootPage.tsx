import { Outlet, ScrollRestoration } from '@tanstack/react-router';
import { Suspense, useEffect } from 'react';
// import { Transmit } from '@adonisjs/transmit-client'
export default function RootPage() {
	useEffect(() => {}, []);

	return (
		<div>
			<ScrollRestoration getKey={(location) => location.pathname} />
			<Suspense fallback={<div>Loading...</div>}>
				<Outlet />
			</Suspense>
			{/* <TanStackRouterDevtools position="bottom-right" /> */}
			{/* <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" /> */}
		</div>
	);
}
