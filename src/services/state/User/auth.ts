import { setToken, ToastError, ToastSuccess } from '@/lib/utils';
import { BASE_URL } from '@/utils/constante';
import { z } from 'zod';
import { create } from 'zustand';
import { combine, createJSONStorage, persist } from 'zustand/middleware';
const userSchema = z.object({
	avatar_url: z.string().nullable(),
	created_at: z.string(),
	email: z.string(),
	id: z.any(),
	location: z.string(),
	name: z.string(),
	phone: z.any(),
	updated_at: z.string(),
	token: z.string().optional(),
	use_whatsapp: z.any(),
	role: z.string(),
});

const userUpdateSchema = z.object({
	avatar_url: z.string().nullable(),
	created_at: z.string(),
	email: z.string(),
	id: z.number(),
	location: z.string(),
	name: z.string(),
	use_whatsapp: z.any(),
	phone: z.any(),
	updated_at: z.string(),
});

const userUpdateToserverSchema = z.object({
	location: z.string(),
	use_whatsapp: z.any(),
	name: z.string(),
	phone: z.string(),
});

export type UserUpdateType = z.infer<typeof userUpdateToserverSchema>;

export type UserData = z.infer<typeof userSchema>;
export const dataToSendSchema = z.object({
	phone: z.string(),
	location: z.string(),
	use_whatsapp: z.any().optional(),
	name: z.string(),
	avatar_url: z.string().nullable(),
	email: z.string(),
	oauth_client_id: z.string(),
	oauth_provider_name: z.string(),
});

export type UserType = z.infer<typeof userSchema>;
export type dataToSendType = z.infer<typeof dataToSendSchema>;

export function getHeadersWithFormData() {
	const token = localStorage.getItem('token');
	return {
		Authorization: `Bearer ${token}`,
	};
}

export function getHeaders() {
	const myHeader = new Headers();
	const token = localStorage.getItem('token');
	myHeader.append('Accept', 'application/json');
	myHeader.append('Content-Type', 'application/json');
	myHeader.append('Authorization', `Bearer ${token}`);
	return myHeader;
}
const putInSto = (t: string | undefined) => {
	if (!t) {
		ToastError('Une erreur est survenue, veuillez reessayer');
		throw new Error('token non trouvé');
	}
	setToken(t);
};
export const useAuth = create(
	persist(
		combine(
			{
				isAuth: false,
				InfoUser: {} as UserType,
				// loading: false,
				isConnect: false,
			},
			(set, get) => ({
				register: async (dataS: dataToSendType) => {
					// set(() => ({ loading: true }));
					const response = await fetch(`${BASE_URL}/create_user`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(dataS),
					});
					const data = await response.json();
					console.log('🚀 ~ register: ~ data:', data);
					const infoUser = userSchema.safeParse(data);

					if (!infoUser.success) {
						console.log(infoUser.error);
						ToastError('Une erreur est survenue, veuillez reessayer' + infoUser.error);
						return;
					}
					ToastSuccess(' Connexion reussie');
					set(() => ({ isAuth: true, InfoUser: infoUser.data, loading: false, isConnect: true }));
					// const token = JSON.parse(infoUser.data.token) ;
					// console.log('🚀 ~ register: ~ infoUser.data.token:', JSON.parse(infoUser.data.token));
					putInSto(infoUser.data.token);
				},
				login: (dataS: UserType) => {
					console.log('🚀 ~ dataS:', dataS);
					const infoUser = userSchema.safeParse(dataS);
					console.log('🚀 ~ infoUser:', infoUser);
					if (!infoUser.success) {
						ToastError('Une erreur est survenues, veuillez reessayer');
						console.log(infoUser.error);

						return;
					}
					putInSto(infoUser.data.token);
					ToastSuccess('Heureux de vous revoir');
					if (infoUser.success)
						set(() => ({ isAuth: true, InfoUser: infoUser.data, loading: false, isConnect: true }));
				},
				me: async () => {
					const response = await fetch('http://localhost:3333/me', {
						method: 'GET',
						headers: getHeaders(),
					});
					const data = await response.json();
					const infoUser = userSchema.safeParse(data);

					if (!infoUser.success) {
						ToastError('Une erreur est survenue, veuillez reessayer');
						return;
					}
					set(() => ({ InfoUser: infoUser.data, isAuth: true }));
				},
				editMe: async (dataS: {
					dataUser: UserUpdateType;
					files: ({ file: File; buffer: string } | string)[];
				}) => {
					const { dataUser, files } = dataS;
					const formData = new FormData();

					files.forEach((photo, index) => {
						if (typeof photo !== 'string') {
							formData.append(
								`avatar_url_${index}`,
								photo.file,
								`avatar_url_${index}.${photo.file.type.split('/')[1]}`
							);
						}
					});
					for (const key in dataUser) {
						let value = dataUser[key];
						if (key === 'use_whatsapp') value = Number(value);
						formData.append(key, value);
					}
						console.log('🚀 ~ formData:', formData);
					const response = await fetch(`${BASE_URL}/edit_me`, {
						method: 'PUT',
						headers: getHeadersWithFormData(),
						body: formData,
					});
					const data = await response.json();
					console.log('🚀 ~ data:', data);
					const infoUser = userSchema.safeParse(data);
					if (!infoUser.success) {
						ToastError('Une erreur est survenue, veuillez reessayer');
						console.log(infoUser.error);
						return;
					} else {
						ToastSuccess('Modification reussie');
						set((state) => {
							return {
								...state,
								InfoUser: infoUser.data,
							};
						});
					}
				},
				logout: async () => {
					const response = await fetch(`${BASE_URL}/disconnection`, {
						method: 'GET',
						headers: getHeaders(),
					});
					const data = await response.json();
					if (data.errors) {
						ToastError('Une erreur est survenue, veuillez reessayer');
						return;
					}
					localStorage.removeItem('token');
					set(() => ({ isAuth: false, InfoUser: {} as UserType, isConnect: false }));
					ToastSuccess(' Deconnexion reussie');
				},
				verifToken: async () => {
					if (!get().isConnect) return;
					const response = await fetch(`${BASE_URL}/try_token`, {
						method: 'GET',
						headers: getHeaders(),
					});
					if (!response.ok) {
						set(() => ({ isAuth: false, InfoUser: {} as UserType }));
					}
					const data = await response.json();
					if (data.errors) {
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
