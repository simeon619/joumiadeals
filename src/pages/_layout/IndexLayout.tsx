import Header from '@/components/root/Header';
import CategoriseMenu from '@/components/ui/CategoriseMenu';
import { titleSite } from '@/utils/constante';
import { Outlet } from '@tanstack/react-router';
import { useTitle } from 'react-use';

export default function IndexLayout() {
	useTitle(titleSite);
	return (
		<div className="md:container md:mx-auto">
			<Header />
			<CategoriseMenu />
			<hr />
			<Outlet />
		</div>
	);
}
