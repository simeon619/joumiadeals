import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useInputCategorie = create(
	combine(
		{
            valueInput: {} as { [k: string]: string | number},
			filesData : [] as (string | ArrayBuffer)[],
			errorInput : {} as { [k: string]: string },
		},
		(set) => ({
			setValueInputs: async (value : { [k: string]: string | number }) => {

				set((state) => ({
					valueInput: {
						...state.valueInput,
						...value
					}
				}));

			},
			setFilesData: async (value : (string | ArrayBuffer)[]) => {

				set((state) => ({
					filesData: value
				}));

			
			},
			setErrorInputs: async (value : { [k: string]: string }) => {

				
				set((state) => ({
					errorInput: {
						...state.errorInput,
						...value
					}
				}));
			},
		})
	)
);