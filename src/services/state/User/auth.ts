import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { z } from 'zod';
import { toast } from 'sonner';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BASE_URL } from '@/utils/constante';
import { getToken, setToken } from '@/lib/utils';
const userSchema = z.object({
	avatar_url: z.string().nullable(),
	created_at: z.string(),
	email: z.string(),
	id: z.string(),
	location: z.string(),
	name: z.string(),
	phone: z.any(),
	updated_at: z.string(),
	token: z.string(),
});

const userUpdateSchema = z.object({
	avatar_url: z.string().nullable(),
	created_at: z.string(),
	email: z.string(),
	id: z.string(),
	location: z.string(),
	name: z.string(),
	phone: z.any(),
	updated_at: z.string(),
});

const userUpdateToserverSchema = z.object({
	avatar_url: z.string().nullable(),
	location: z.string(),
	name: z.string(),
	phone: z.any(),
});

export type UserUpdateType = z.infer<typeof userUpdateToserverSchema>;

export type UserData = z.infer<typeof userSchema>;
export const dataToSendSchema = z.object({
	phone: z.string(),
	location: z.string(),
	name: z.string(),
	avatar_url: z.string().nullable(),
	email: z.string(),
	oauth_client_id: z.string(),
	oauth_provider_name: z.string(),
});

export type UserType = z.infer<typeof userSchema>;
export type dataToSendType = z.infer<typeof dataToSendSchema>;

export function getHeaders() {
	const myHeader = new Headers();
	const token = localStorage.getItem('token');
	myHeader.append('Accept', 'application/json');
	myHeader.append('Content-Type', 'application/json');
	myHeader.append('Authorization', `Bearer ${token}`);

	return myHeader;
}

export const useAuth = create(
	persist(
		combine(
			{
				isAuth: false,
				InfoUser: {} as UserType,
				loading: false,
			},
			(set) => ({
				register: async (dataS: dataToSendType) => {
					set(() => ({ loading: true }));
					const response = await fetch(`${BASE_URL}/create_user`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(dataS),
					});

					const data = await response.json();
					const infoUser = userSchema.safeParse(data);

					if (!infoUser.success) {
						console.log(infoUser.error);
						toast.error('Une erreur est survenue, veuillez reessayer', {
							position: 'top-center',
							style: { background: '#f87171', color: 'white' },
						});
						return;
					}
					toast.success(' Connexion reussie', { position: 'top-center' });
					set(() => ({ isAuth: true, InfoUser: infoUser.data, loading: false }));
					setToken(infoUser.data.token);
				},

				login: (dataS: UserType) => {
					const infoUser = userSchema.safeParse(dataS);
					if (!infoUser.success) {
						console.log(infoUser.error);
						toast.error('Une erreur est survenue, veuillez reessayer', {
							position: 'top-center',
							style: { background: '#f87171', color: 'white' },
						});
						return;
					}
					setToken(infoUser.data.token);
					toast.success('Heureux de vous revoir', {
						position: 'top-center',
						style: { background: 'green', color: 'white' },
					});
					set(() => ({ isAuth: true, InfoUser: infoUser.data, loading: false }));
				},

				me: async () => {
					const response = await fetch('http://localhost:3000/me', {
						method: 'GET',
						headers: getHeaders(),
					});
					const data = await response.json();
					const infoUser = userSchema.safeParse(data);

					if (!infoUser.success) {
						console.log(infoUser.error);
						toast.error('Une erreur est survenue, veuillez reessayer', {
							position: 'top-center',
							style: { background: '#f87171', color: 'white' },
						});
						return;
					}
					set(() => ({ InfoUser: infoUser.data, isAuth: true }));
				},
				editMe: async (dataS: UserUpdateType) => {
					console.log('🚀 ~ editMe: ~ dataS:', dataS);
					const response = await fetch(`${BASE_URL}/edit_me`, {
						method: 'PUT',
						headers: getHeaders(),
						body: JSON.stringify(dataS),
					});
					const data = await response.json();
					const infoUser = userUpdateSchema.safeParse(data);
					if (!infoUser.success) {
						console.log(infoUser.error);
						toast.error('Une erreur est survenue, veuillez reessayer', {
							position: 'top-center',
							style: { background: '#f87171', color: 'white' },
						});
						return;
					} else {
						toast.success('Modification reussie', {
							position: 'top-center',
							style: { background: 'green', color: 'white' },
						});

						set(() => ({ InfoUser: { ...infoUser.data, token: getToken() }, isAuth: true }));
					}
				},
				logout: async () => {
					const response = await fetch(`${BASE_URL}/disconnection`, {
						method: 'GET',
						headers: getHeaders(),
					});
					const data = await response.json();
					if (data.errors) {
						toast.error('Une erreur est survenue, veuillez reessayer', {
							position: 'top-center',
							style: { background: '#f87171', color: 'white' },
						});
						return;
					}
					localStorage.removeItem('token');
					set(() => ({ isAuth: false, InfoUser: {} as UserType }));
					toast.success(' Deconnexion reussie', {
						position: 'top-center',
						style: { background: 'green', color: 'white' },
					});
				},
				verifToken: async () => {
					const response = await fetch(`${BASE_URL}/try_token`, {
						method: 'GET',
						headers: getHeaders(),
					});
					const data = await response.json();
					if (!data.valid) {
						localStorage.removeItem('token');
						set(() => ({ isAuth: false, InfoUser: {} as UserType }));
					}
				},
			})
		),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => localStorage),
		}
	)
);
