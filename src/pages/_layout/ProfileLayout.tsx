import Header from '@/components/root/Header';
import { Outlet } from '@tanstack/react-router';
import Wrap1 from './Wrap1';

export default function ProfileLayout() {
	return (
		<div className="h-fit">
			<Header />
			<hr />
			<Wrap1 child={<Outlet />} />
		</div>
	);
}
