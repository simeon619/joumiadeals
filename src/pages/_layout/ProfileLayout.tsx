import Header from '@/components/root/Header';
import { Outlet } from '@tanstack/react-router';

export default function ProfileLayout() {
	return (
		<div>
			<Header />
			<hr />
			<div className="flex h-screen select-none justify-center">
				<div className="w-app ">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
