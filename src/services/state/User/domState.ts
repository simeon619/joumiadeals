import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export const useRefDomTrigger = create(
	combine(
		{
			scopeTrigger: null as React.RefObject<HTMLDivElement> | null,
		},
		(set) => ({
			setScopeTrigger: (ref: React.RefObject<HTMLDivElement> | null) => {
				set({ scopeTrigger: ref });
			},
		})
	)
);
