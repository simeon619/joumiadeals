import Header from '@/components/root/Header';
import CategoriseMenu from '@/components/ui/CategoriseMenu';
import { titleSite } from '@/utils/constante';
import { Outlet } from '@tanstack/react-router';
import { useTitle } from 'react-use';
import Wrap1 from './Wrap1';

export default function IndexLayout() {
	useTitle(titleSite);
	return (
		<div className="relative h-fit w-screen">
			<Header />
			<CategoriseMenu />
			<hr />
			<Wrap1 child={<Outlet />} />
			
		</div>
	);
}
