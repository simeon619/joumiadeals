import { ToastWarn } from '@/lib/utils';
import { create } from 'zustand';
import { combine, createJSONStorage, persist } from 'zustand/middleware';
export const useInputCategorie = create(
	persist(
		combine(
			{
				dataProduct: {} as { [k: string]: string | number | undefined | null },
				dataProductFeature: {} as { [k: string]: string | number | undefined | null },
				errorInput: {} as { [k: string]: string },
				filesData: [] as ({ file: File; buffer: string } | string)[],
				inputFocus: {} as { [k: string]: boolean },
			},
			(set, get) => ({
				setDataProduct: async (value: { [k: string]: string | number | undefined | null }) => {
					set((state) => ({
						dataProduct: {
							...state.dataProduct,
							...value,
						},
					}));
				},
				setDataProductFeature: async (value: { [k: string]: string | number | undefined | null }) => {
					set((state) => ({
						dataProductFeature: {
							...state.dataProductFeature,
							...value,
						},
					}));
				},
				setFilesData: async (value: { file: File; buffer: string }, max?: number) => {
					if (!value.buffer && !value.file) return;
					set((state) => {
						if (state.filesData.length >= (max || 5)) {
							ToastWarn("Vous avez atteint le nombre maximum d'image");
							return state;
						}
						return {
							filesData: [...state.filesData, value],
						};
					});
				},

				setInputFocus: async (value: { [k: string]: boolean }) => {
					const v = Object.keys(value)[0];
					set(() => ({
						inputFocus: {
							...value,
						},
					}));

					const allInputsBlurred = Object.values(get().inputFocus).every((value) => value === false);
					if (allInputsBlurred) {
						set({
							inputFocus: {
								[Object.keys(get().dataProduct)[Array.from(Object.keys(get().dataProduct)).indexOf(v)]]:
									true,
							},
						});
					}
				},

				setFile: async (value: ({ file: File; buffer: string } | string)[]) => {
					set(() => ({
						filesData: value,
					}));
				},
				removeFile: async (index: number) => {
					set((state) => ({
						filesData: state.filesData.filter((_, i) => i !== index),
					}));
				},
				setErrorInputs: async (value: { [k: string]: string }) => {
					set((state) => ({
						errorInput: {
							...state.errorInput,
							...value,
						},
					}));
				},
				resetAll: () => {
					return set({ dataProductFeature: {}, errorInput: {} });
				},
				resetFile : () => {
					return set({ filesData: [] });
				}
			})
		),
		{
			name: 'file-storage',
			storage: createJSONStorage(() => localStorage),
		}
	)
);
