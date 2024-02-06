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
		avatarUrl?: string | null;
		oauth_provider_name: string;
        phone: string;
		oauth_client_id: string;
		token: string;
		location: string;
	};
	const name = searchParams.name;
	const token = searchParams.token;
	const location = searchParams.location;
    const phone = searchParams.phone;

	const email = searchParams.email!;
	const avatarUrl = searchParams.avatarUrl as string;
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
                page: 'location',
                send: {
                    phone,
                    avatar_url: avatarUrl,
                    name,
                    email,
                    location,
                    token:{ token, type: 'Bearer' },
                    access_id: '',
                    acl_id: '',
                    createdAt: Date.now().toString(),
                    updatedAt: Date.now().toString(),
                    id: '',
                },
            });
		}
	}, []);

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-[#115570]">
			<h1 className="text-3xl font-bold text-white"> Vous serez redirige </h1>
		</div>
	);
}
