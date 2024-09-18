import { Outlet } from '@tanstack/react-router';

export default function AuthLayout() {
	return (
		<div>
			{/* <HeaderAuth /> */}
			<div>
				<hr />
				<Outlet />
			</div>
		</div>
	);
}
