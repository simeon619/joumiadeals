// import { useAuth } from '@/services/state/User/auth';
import { myprofileRoot } from '@/lib/route';
import { redirectToConnect } from '@/lib/utils';
import { useAuth } from '@/services/state/User/auth';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

export default function LoginPage() {
	const router = useRouter();
	const navigate = useNavigate();
	const { login } = useAuth();
	const searchParams = router.latestLocation.search as {
		name: string;
		id: string;
		email: string;
		avatar_url?: string | null;
		oauth_provider_name: string;
		phone: string;
		oauth_client_id: string;
		token: string;
		location: string;
		created_at: string;
		updated_at: string;
		use_whatsapp: number;
	};
	const name = searchParams.name;
	const id = searchParams.id;
	const token = searchParams.token;
	const location = searchParams.location;
	const phone = searchParams.phone;
	const created_at = searchParams.created_at;
	const updated_at = searchParams.updated_at;
	const email = searchParams.email!;
	const avatar_url = searchParams.avatar_url as string;
	const use_whatsapp = searchParams.use_whatsapp;
	// const oauth_provider_name = searchParams.oauth_provider_name!;
	// const oauth_client_id = searchParams.oauth_client_id!;

	useLayoutEffect(() => {
		if (!token && !email && !phone) {
			redirectToConnect();
		}
	}, []);
	// search={{ provider_id: InfoUser.id }}
	useLayoutEffect(() => {
		if (name && token && location) {
			navigate({
				to: myprofileRoot.to,
				search: { provider_id: id, filter: { order_by: 'date_asc' } },
			});
			// router.history.push('/myprofile?provider_id=' + id);
			console.log({ name, token, location });
			login({
				phone,
				avatar_url,
				name,
				email,
				location,
				token,
				created_at,
				updated_at,
				use_whatsapp: Number(use_whatsapp),
				id,
			});
		}
	}, []);

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-[#115570]">
			<h1 className="text-3xl font-bold text-white"> Vous serez redirige </h1>
		</div>
	);
}
