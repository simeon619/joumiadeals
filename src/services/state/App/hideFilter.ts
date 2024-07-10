import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';

export const useHideFilter = create(
	combine(
		{
			value: 0 as number,
			direction : 'up' as 'up' | 'down',
		},
		(set) => ({
			setScrollPercent: async (value: number) => {
				set(() => ({
					value,
				}));
			},
			setDirection: async (value: 'up' | 'down') => {
				set(() => ({
					direction: value,
				}));
			},
		})
	)
);
