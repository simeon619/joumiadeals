import { Outlet } from '@tanstack/react-router';

export default function AuthLayout() {
	return (
		<div className="select-none">
			{/* <HeaderAuth /> */}
			<div>
				<hr />
				<Outlet />
			</div>
		</div>
	);
}
