/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useAuth } from '@/services/state/User/auth';
import { redirectToConnect } from '@/lib/utils';
import { useAuth } from '@/services/state/User/auth';
import { useRouter } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { useLayoutEffect } from 'react';

export default function LoginPage() {
	const router = useRouter();
	const isAuth = useAuth((state) => state.isAuth);
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
		role: string;
	};
	console.log('🚀 ~ LoginPage ~ searchParams:', searchParams);
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
	const role = searchParams.role;
	useLayoutEffect(() => {
		if (!token && !email && !phone) {
			redirectToConnect();
		}
	}, []);
	useLayoutEffect(() => {
		if (name && token && location) {
			const customEvent = new CustomEvent('iui', {
				detail: {
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
					role,
				},
			});
			window.opener.dispatchEvent(customEvent);
			close();
		}
	}, []);

	return (
		<div className="flex h-screen w-screen flex-col items-center justify-center gap-y-6">
			<h1 className="text-3xl font-bold">Veuillez patientez...</h1>
			<Loader className="animate-spin" size={50} />
		</div>
	);
}
