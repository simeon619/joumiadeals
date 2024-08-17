/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryType, f_form_type } from '@/services/api/product_categorie';

export const filterCategory = (searchTerm: string, data: CategoryType, fields: f_form_type[]) => {
	const normalizedSearchTerm = searchTerm
		.normalize('NFD')
		.replace(/[\u0300-\u036f\s()\-/,+'']/g, '')
		.toLowerCase();

	const filtered = data.filter((item) => {
		const labelNormalized = item.label
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f\s()\-/,+'']/g, '');

		const labelMatch = labelNormalized.includes(normalizedSearchTerm);

		const field = fields.filter((field) => field.category_id === item.id);
		const caracMatch = field?.some((fieldItem) =>
			fieldItem.enum?.some((enumItem) => {
				const enumItemNormalized = (enumItem as string)
					.toLowerCase()
					.normalize('NFD')
					.replace(/[\u0300-\u036f\s()\-/,+'']/g, '');
				return enumItemNormalized.includes(normalizedSearchTerm);
			})
		);

		return labelMatch || caracMatch;
	});

	return filtered;
};

// export const filterCategory = (searchTerm: string, data: CategoryType) => {
//   const searchTerms = searchTerm
//       .normalize('NFD')
//       .replace(/[\u0300-\u036f\s()\-,[+]'']/g, '')
//       .toLowerCase()

//   const filtered = data.filter((item) => {
//       const labelNormalized = item.label
//           .toLowerCase()
//           .normalize('NFD')
//           .replace(/[\u0300-\u036f\s()\-,[+]'']/gi, '');

//       const labelMatch = searchTerms.includes(labelNormalized);

//       const caracMatch = item.caracteristique_field.some((carac: { [x: string]: any[] }) => {
//           if (carac && carac['enum']) {
//               return carac['enum'].some((el: string) => {
//                   const elNormalized = el.normalize('NFD').replace(/[\u0300-\u036f\s()\-,[+]'']/gi, '');
//                   return searchTerms.includes(elNormalized);
//               });
//           }
//           return false;
//       });

//       return labelMatch || caracMatch;
//   });

//   return filtered;
// };
