import { FilterProductType } from '@/utils/queryOptions';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export const useHideFilter = create(
	combine(
		{
			value: 0 as number,
			direction: 'up' as 'up' | 'down',
		},
		(set) => ({
			setScrollPercent: (value: number) => {
				set(() => ({
					value,
				}));
			},
			setDirection: (value: 'up' | 'down') => {
				set(() => ({
					direction: value,
				}));
			},
		})
	)
);

export const useSearchFilter = create(
	combine(
		{
			value: {} as Omit<FilterProductType, 'status'>,
		},
		(set) => ({
			setFilter: (value: Omit<FilterProductType, 'status'>) => {
				set(() => ({
					value,
				}));
			},
		})
	)
)

export const useShowPopupFilter = create(
	combine(
		{
			value: false as boolean,
		},
		(set) => ({
			setShowPopup: (value: boolean) => {
				set(() => ({
					value,
				}));
			},
		})
	)
);
