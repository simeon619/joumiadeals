import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { z } from 'zod';
import { toast } from 'sonner';
import { setItemLocalStorage } from '@/lib/utils';
import { persist, createJSONStorage } from 'zustand/middleware';


const userSchema =  z.object({
	avatar_url: z.string(),
	created_at: z.string(),
	email: z.string(),
	id: z.string(),
	location: z.string(),
	name: z.string(),
	phone: z.string(),
	updated_at: z.string(),
	token: z.string(),
})

export type UserData = z.infer<typeof userSchema>;
export const dataToSendSchema = z.object({
	phone: z.string(),
	location: z.string(),
	name: z.string(),
	avatarUrl: z.string().nullable(),
	email: z.string(),
	oauth_client_id: z.string(),
	oauth_provider_name: z.string(),
});

export type UserType = z.infer<typeof userSchema>;
export type dataToSendType = z.infer<typeof dataToSendSchema>;

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
					const response = await fetch('http://localhost:3000/create_user', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(dataS),
					});

					const data = await response.json();
					console.log("🚀 ~ register: ~ data:", data)
					const infoUser = userSchema.safeParse(data);

					if (!infoUser.success) {
						console.log(infoUser.error);
						toast.error('Une erreur est survenue, veuillez reessayer', { position: 'top-center' });
						return;
					}
					toast.success(' Connexion reussie', { position: 'top-center' });
					set(() => ({ isAuth: true, InfoUser: infoUser.data, loading: false }));
					setItemLocalStorage<string>('token', infoUser.data.token);
				},

				login: async (dataS: UserType) => {
					
					const infoUser = userSchema.safeParse(dataS);
					if (!infoUser.success) {
						console.log(infoUser.error);
						toast.error('Une erreur est survenue, veuillez reessayer', { position: 'top-center' });
						return;
					}
					toast.success('Heureux de vous revoir', { position: 'top-center' });
					set(() => ({ isAuth: true, InfoUser: infoUser.data, loading: false }));
				},
				me: async () => {
					const response = await fetch('http://localhost:3000/me', {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${localStorage.getItem('token')}`,
						},
					});
					const data = await response.json();
					const infoUser = userSchema.safeParse(data);

					if (!infoUser.success) {
						console.log(infoUser.error);
						toast.error('Une erreur est survenue, veuillez reessayer', { position: 'top-center' });
						return;
					}
					set(() => ({ InfoUser: infoUser.data, isAuth: true }));
				},
				logout: () => {
					localStorage.removeItem('token');
					toast.success(' Deconnexion reussie', { position: 'top-center' });
					fetch('http://localhost:3000/disconnection');
					set(() => ({ isAuth: false, InfoUser: {} as UserType }));
				},
			})
		),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => localStorage),
		}
	)
);
