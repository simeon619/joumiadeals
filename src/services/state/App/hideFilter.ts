import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';

export const useHideFilter = create(
	combine(
		{
			value: false,
		},
		(set) => ({
			toggleValue: async (value: boolean) => {
				set(() => ({
					value,
				}));
			},
		})
	)
);
