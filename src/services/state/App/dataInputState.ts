import { CategoryType, FieldOptionsType } from '@/services/api/product_categorie';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useDataInputState = create(
	persist(
		combine(
			{
				labelList: [] as { label: string; id: string }[],
				lastChild: {} as CategoryType[0],
				fieldCharac: [] as FieldOptionsType,
				productSelect: {} as CategoryType[0] | undefined,
				childsCategorie: [] as CategoryType,
				labelSuggest: '',
				suggestCategory: [] as { id: string; suggest: string; icon: string | null }[],
				step: 'one' as 'one' | 'two' | 'three',
				mainInput : {
					title : '',
					description : '',
					price : '',
				} as { title : string; description : string; price : string },
			},
			(set) => ({
				setStep: (step: 'one' | 'two' | 'three') => set((state) => ({ ...state, step })),
				setMainInput : (mainInput : { title : string; description : string; price : string }) => set((state) => ({ ...state, mainInput })),
				removeLabel: () => set((state) => ({ ...state, labelList: state.labelList.slice(0, -1) })),
				setLabelList: (data: CategoryType[0]) => {
					if (!data.parent_category_id) {
						set((state) => ({
							...state,
							labelList: [{ label: data.label, id: data.id }],
						}));
					}
					set((state) => {
						const index = state.labelList.findIndex((item) => item.label === data.label);
						if (index === -1 && data.is_parentable === 0) {
							return {
								...state,
								labelList: [...state.labelList, { label: data.label, id: data.id }],
							};
						}
						return state;
					});
				},
				setLastChild: (lastChild: CategoryType[0] | undefined) =>
					set((state) => ({
						...state,
						lastChild,
					})),
				setFieldCharac: (fieldCharac: FieldOptionsType) =>
					set((state) => ({
						...state,
						fieldCharac,
					})),
				setSuggestCategory: (data: { id: string; suggest: string; icon: string | null }[]) => {
					set((state) => ({
						...state,
						suggestCategory: data,
					}));
				},
				setChildsCategorie: (data: CategoryType | undefined) =>
					set((state) => ({ ...state, childsCategorie: data })),
				setLabelSuggest: (labelSuggest: string) => set((state) => ({ ...state, labelSuggest })),
				setProductSelect: (productSelect: CategoryType[0] | undefined) =>
					set((state) => ({
						...state,
						productSelect,
					})),
			})
		),
		{
			name: 'data-input',
			storage: createJSONStorage(() => localStorage),
		}
	)
);
