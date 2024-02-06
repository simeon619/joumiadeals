// import { useAuth } from '@/services/state/User/auth';
import { redirectToConnect } from '@/lib/utils';
import { useAuth } from '@/services/state/User/auth';
import { useRouter } from '@tanstack/react-router';
import { useLayoutEffect } from 'react';

export default function LoginPage() {
	const router = useRouter();
	const { login } = useAuth();
	const searchParams = router.latestLocation.search as {
		name: string;
		email: string;
		avatar_url?: string | null;
		oauth_provider_name: string;
        phone: string;
		oauth_client_id: string;
		token: string;
		location: string;
		created_at: string;
		updated_at: string;
	};
	const name = searchParams.name;
	const token = searchParams.token;
	const location = searchParams.location;
    const phone = searchParams.phone;
	const created_at = searchParams.created_at;
	const updated_at = searchParams.updated_at;
	const email = searchParams.email!;
	console.log("🚀 ~ LoginPage ~ searchParams:", searchParams)
	const avatar_url = searchParams.avatar_url as string;
	// const oauth_provider_name = searchParams.oauth_provider_name!;
	// const oauth_client_id = searchParams.oauth_client_id!;

	useLayoutEffect(() => {
		if (!token && !email && !phone) {
			redirectToConnect();
		}
	}, []);
	useLayoutEffect(() => {
		if (name && token && location) {
			router.history.push('/profile');
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
                    id: '',
            });
		}
	}, []);

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-[#115570]">
			<h1 className="text-3xl font-bold text-white"> Vous serez redirige </h1>
		</div>
	);
}
