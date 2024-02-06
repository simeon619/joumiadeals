import Header from '@/components/root/Header';
import { Outlet } from '@tanstack/react-router';

export default function ProfileLayout() {
	return (
		<div>
			<Header />
			<hr />
			<Outlet />
		</div>
	);
}
