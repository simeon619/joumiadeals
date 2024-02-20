import { ToastWarn } from '@/lib/utils';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

export const useInputCategorie = create(
	combine(
		{
			valueInput: {} as { [k: string]: string | number | undefined },
			filesData: [] as ({file :File , buffer : string } | string)[],
			errorInput: {} as { [k: string]: string },
		},
		(set) => ({
			setValueInputs: async (value: { [k: string]: string | number | undefined }) => {
				set((state) => ({
					valueInput: {
						...state.valueInput,
						...value,
					},
				}));
			},
			setFilesData: async (value: {file :File , buffer : string  }, max?: number) => {
				if (!value.buffer && !value.file ) return;
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

			setFile : async (value: ({file :File , buffer : string} | string)[]) => {
				set(() => ({
					filesData:value,
				}));
			},
			removeFile: async (index : number) => {
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
			resetAll: () => set({ valueInput: {}, filesData: [], errorInput: {} }),
		})
	)
);
