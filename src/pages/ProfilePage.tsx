import { useAuth } from '@/services/state/User/auth';
// import {
// 	useLayoutEffect,
// 	useRouter,
// } from '@tanstack/react-router';

export default function ProfilePage() {
	const { logout, isAuth } = useAuth();
	// const router = useRouter();
	// useLayoutEffect(() => {
	// 	if (!isAuth) {
	// 		router.history.push('/');
	// 	}
	// }, [isAuth]);
	

	return (
		<div>
			<button onClick={logout}>
				logout 
			</button>
			<h1>{JSON.stringify(isAuth)}</h1>
		</div>
	);
}
