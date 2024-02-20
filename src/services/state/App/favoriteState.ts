import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';

export const useFavorite = create(
	persist(
		combine(
			{
				favorite: [] as string[],
			},
			(set) => ({
				addFavorite: async (id: string) => {
					set((state) => ({
						favorite: [...state.favorite, id],
					}));
				},
				removeFavorite: async (id: string) => {
					set((state) => ({
						favorite: state.favorite.filter((item) => item !== id),
					}));
				},
				resetFavorite: () => set({ favorite: [] }),
			})
		),
		{ name: 'favorite-storage' }
	)
);
