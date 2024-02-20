import Header from '@/components/root/Header';
import CategoriseMenu from '@/components/ui/CategoriseMenu';
import { Outlet } from '@tanstack/react-router';

export default function IndexLayout() {
	return (
		<div className="flex select-none justify-center">
			<div className="flex w-full flex-col font-poppins">
				<Header />
				<CategoriseMenu />
				<hr />
				<Outlet />
			</div>
		</div>
	);
}
