import Header from '@/components/root/Header';
import { Outlet } from '@tanstack/react-router';

export default function IndexLayout() {
	return (
		<div className="h-screen w-screen bg-[#ffffff]">
			<Header />
			<hr />
			<Outlet />
		</div>
	);
}
