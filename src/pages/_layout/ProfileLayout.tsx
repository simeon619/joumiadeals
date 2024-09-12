import Header from '@/components/root/Header';
import { Outlet } from '@tanstack/react-router';
import Wrap1 from './Wrap1';

export default function ProfileLayout() {
	return (
		<div className="h-dvh">
			<Header />
			<hr />
			<Wrap1 child={<Outlet />} />
			{/* <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-[1fr_minmax(900px,_1fr)_1fr]">
				<div className="hidden bg-slate-500 px-4 lg:block">Contenu gauche</div>
				<div className="bg-white px-4">
					<Outlet />
				</div>
				<div  className="hidden bg-slate-500 px-4 lg:block">Contenu droit</div>
			</div> */}
		</div>
	);
}
