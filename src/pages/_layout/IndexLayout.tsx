import Header from '@/components/root/Header';
import CategoriseMenu from '@/components/ui/CategoriseMenu';
import { titleSite } from '@/utils/constante';
import { Outlet } from '@tanstack/react-router';
import { useTitle } from 'react-use';

export default function IndexLayout() {
	useTitle(titleSite)
	return (
		<>
			<div className="flex justify-center">
				<div className="flex w-full flex-col font-poppins">
					<Header />
					<CategoriseMenu />
					<hr />
					<Outlet />
				</div>
			</div>
		</>
	);
}
