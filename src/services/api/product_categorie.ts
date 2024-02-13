/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL } from '@/utils/constante';
import { z } from 'zod';
import { getHeaders } from '../state/User/auth';
const FieldSchema = z.enum([
	'button',
	'checkbox',
	'color',
	'date',
	'datetime-local',
	'email',
	'file',
	'hidden',
	'image',
	'month',
	'number',
	'password',
	'radio',
	'range',
	'reset',
	'search',
	'submit',
	'select',
	'tel',
	'text',
	'time',
	'url',
	'week',
]);

const FieldOptionSchema = z.array(
	z.object({
		type: z.enum(['string', 'number', 'boolean', 'date', 'files']),
		name: z.string(),
		placeholder: z.string().optional(),
		field: FieldSchema,
		require: z.boolean().optional(),
		default: z.string().optional(),
		icon: z.string(),
		match: z.tuple([z.string(), z.string()]).optional(),
		enum: z.array(z.union([z.string(), z.number()])).optional(),
		min: z.number().optional(),
		max: z.number().optional(),
		maxSize: z.number().optional(),
		mime: z.array(z.union([z.string(), z.tuple([z.string(), z.number()])])),
	})
);

export type FieldOptionsType = z.infer<typeof FieldOptionSchema>;

const CategorySchema = z.array(
	z.object({
		id: z.string(),
		label: z.string(),
		caracteristique_field: z.string().transform((data) => {
			const field = JSON.parse(data) as FieldOptionsType;
			return field;
		}),
		parent_category_id: z.string().nullable(),
		is_parentable: z.number(),
		created_at: z.string(),
		updated_at: z.string(),
	})
);

export type CategoryType = z.infer<typeof CategorySchema>;
export async function getAllChildCategories() {
	try {
		const response = await fetch(`${BASE_URL}/get_category_all_child_list`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ id: null }),
		});

		if (!response.ok) {
			throw new Error('Erreur lors de la récupération des catégories');
		}

		const data = await response.json();
		const validationResult = CategorySchema.safeParse(data);

		if (!validationResult.success) {
			throw new Error(validationResult.error.message);
		}

		return validationResult.data;
	} catch (error) {
		console.error('Erreur lors de la récupération des catégories :', error);
		throw error;
	}
}

export async function createProduct(dataProduct: Record<string, any>) {
	const formData = new FormData();
	for (const [key, value] of Object.entries(dataProduct)) {
		formData.append(key, value);
	}
	try {
		const response = await fetch(`${BASE_URL}/create_product`, {
			method: 'POST',
			headers: getHeaders(),
			body: formData,
		});
		if (!response.ok) {
			throw new Error('Erreur lors de la création du produit');
		}
		const data = await response.json();
		console.log('Données du produit créé :', data);
		return data;
	} catch (error) {
		console.error('Erreur lors de la création du produit :', error);
		throw error;
	}
}
