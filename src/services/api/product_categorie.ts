/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL, LimitItemPaginate } from '@/utils/constante';
import { z } from 'zod';
import { getHeaders, getHeadersWithFormData } from '../state/User/auth';
import { RequestDataType } from '@/utils/queryOptions';
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
		icon: z.string().nullable(),
		// caracteristique_field: z.string().transform((data) => {
		// 	const field = JSON.parse(data) as FieldOptionsType;
		// 	return field;
		// }),
		caracteristique_field: z.any(),
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
			body: JSON.stringify({ category_id: null }),
		});
		if (!response.ok) {
			throw new Error('Erreur lors de la récupération des catégories');
		}
		const data = await response.json();
		console.log("🚀 ~ getAllChildCategories ~ data:", data)
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

export async function createProduct(data: {
	dataProduct: Record<string, any>;
	photos: (
		| string
		| {
				file: File;
				buffer: string;
		  }
	)[];
}) {
	const { dataProduct, photos } = data;
	const formData = new FormData();
	for (const key in dataProduct) {
		formData.append(key, dataProduct[key]);
	}
	photos.forEach((photo, index) => {
		if (typeof photo !== 'string')
			formData.append(
				`photos_${index}`,
				photo.file,
				`photo_${index}.${photo.file.type.split('/')[1]}`
			);
	});
	try {
		const response = await fetch(`${BASE_URL}/create_product`, {
			method: 'POST',
			headers: getHeadersWithFormData(),
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
const ProductMinSchema = z.object({
	avatar_url: z.string(),
	photos: z.array(z.string()),
	price: z.number(),
	name: z.string(),
	location: z.string(),
	category_id: z.string(),
	express_time: z.string().nullable(),
	description: z.string(),
	title: z.string(),
	caracteristique: z.any(),
	status: z.number(),
	product_id: z.string(),
	product_created_at: z.string(),
});

export const ProductsDataSchema = z.array(ProductMinSchema);

export type ProductsMinType = z.infer<typeof ProductsDataSchema>;

const ProductShemaPaginate = z.object({
	products: ProductsDataSchema,
	total: z.number(),
});

export type ProductsData = z.infer<typeof ProductShemaPaginate>;

export async function getProductsByFiltr(requestData: RequestDataType) {
	const response = await fetch(`${BASE_URL}/filter_product`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify(requestData),
	});
	const data = await response.json();
	const products = ProductShemaPaginate.safeParse(data);
	if (!products.success) {
		console.log(products.error);
		throw new Error(products.error.message);
	}
	return products.data;
}

const ProviderSchema = z.object({
	id: z.string(),
	name: z.string(),
	location: z.string(),
	email: z.string().email(),
	use_whatsapp: z.number(),
	avatar_url: z.string().url(),
	phone: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

const ProductDetailSchema = z.object({
	id: z.string(),
	title: z.string(),
	price: z.number(),
	description: z.string(),
	status: z.number(),
	photos: z.array(z.string()),
	express_time: z.nullable(z.string()),
	last_appearance: z.nullable(z.string()),
	caracteristique: z.any(),
	moderator_id: z.nullable(z.string()),
	category_id: z.string(),
	account_id: z.string(),
	created_at: z.string(),
	provider: ProviderSchema,
});

export type ProductDetailType = z.infer<typeof ProductDetailSchema>;
export async function getProduct(id: string) {
	const response = await fetch(`${BASE_URL}/get_product`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({ product_id: id }),
	});
	const data = await response.json();
	const product = ProductDetailSchema.safeParse(data);
	if (!product.success) {
		console.log(product.error);
		throw new Error(product.error.message);
	}
	return product.data;
}

export async function deleteProduct(id: string) {
	const response = await fetch(`${BASE_URL}/delete_product`, {
		method: 'DELETE',
		headers: getHeaders(),
		body: JSON.stringify({ product_id: id }),
	});
	const data = await response.json();
	console.log("🚀 ~ deleteProduct ~ data:", data)
	if (!data.isDeleted) {
		throw new Error('Erreur lors de la suppression du produit');
	}
}

export async function updateProduct(dataUpdate: {
	dataProduct: Record<string, any>;
	photosFile: (
		| string
		| {
				file: File;
				buffer: string;
		  }
	)[];
}) {
	const { dataProduct, photosFile } = dataUpdate;
	const formData = new FormData();
	for (const key in dataProduct) {
		formData.append(key, dataProduct[key]);
	}

	const photos = photosFile.map((photo, index) => {
		if (typeof photo !== 'string') {
			const gt = `photos_${index}`;
			return gt;
		} else return photo;
	});

	photosFile.forEach((photo, index) => {
		if (typeof photo !== 'string') {
			formData.append(
				`photos_${index}`,
				photo.file,
				`photo_${index}.${photo.file.type.split('/')[1]}`
			);
		}
	});
	formData.append('photos', JSON.stringify(photos));
	try {
		const response = await fetch(`${BASE_URL}/update_product`, {
			method: 'PUT',
			headers: getHeadersWithFormData(),
			body: formData,
		});

		if (!response.ok) {
			throw new Error('Erreur lors de la mise a jour du produit');
		}

		const data = await response.json();
		console.log('🚀 ~ updateProduct ~ data:', data);
		return data;
	} catch (error) {
		console.error('Erreur lors de la création du produit :', error);
		throw error;
	}
}

const IdSchemaProduct = z.array(z.string());

export async function getFavouriteProductsId() {
	try {
		const response = await fetch(`${BASE_URL}/get_all_favorite_products_id`, {
			method: 'POST',
			headers: getHeaders(),
		});
		const data = await response.json();
		const products = IdSchemaProduct.safeParse(data);
		if (!products.success) {
			console.log(products.error);
			throw new Error(products.error.message);
		}
		return products.data;
	} catch (error) {
		console.error('recuperation id produit favorit error :', error);
		throw error;
	}
}
const addFavouriteProductSchema = z.object({
	account_id: z.string(),
	product_id: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});
export async function addFavouriteProduct(id: string) {
	try {
		const response = await fetch(`${BASE_URL}/add_favorite_product`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ product_id: id }),
		});
		const data = await response.json();
		const product = addFavouriteProductSchema.safeParse(data);
		if (!product.success) {
			console.log(product.error);
			throw new Error(product.error.message);
		}
		return data;
	} catch (error) {
		console.error('add produit favorit error :', error);
		throw error;
	}
}

export async function deleteFavouriteProduct(id: string) {
	try {
		const response = await fetch(`${BASE_URL}/delete_favorite_product`, {
			method: 'DELETE',
			headers: getHeaders(),
			body: JSON.stringify({ product_id: id }),
		});
		console.log('🚀 ~ deleteFavouriteProduct ~ response:', response);
		const data = await response.json();
		console.log('🚀 ~ deleteFavouriteProduct ~ data:', data);
		if (!data.deleted) {
			throw new Error('Erreur lors de la suppression du produit');
		}
	} catch (error) {
		console.error('Erreur lors de la suppression du produit:', error);
		throw error;
	}
}

const FavouriteShemaPaginate = z.object({
	favorites: ProductsDataSchema,
	total: z.number(),
});

export type FavouriteDataType = z.infer<typeof FavouriteShemaPaginate>;
export const pageSchema = z.object({ page: z.number(), limit: z.number().optional() }).default({ page: 1 , limit: LimitItemPaginate});
export type pageType = z.infer<typeof pageSchema>;
export async function getFavouriteProduct(paginate: pageType) {
	try {
		const response = await fetch(`${BASE_URL}/get_favorite_products`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ ...paginate, limit: LimitItemPaginate }),
		});
		const data = await response.json();
		console.log('🚀 ~ getFavouriteProduct ~ data:', data);
		const products = FavouriteShemaPaginate.safeParse(data);
		if (!products.success) {
			console.log(products.error);
			throw new Error(products.error.message);
		}
		return products.data;
	} catch (error) {
		console.error('recuperation id produit favorit error :', error);
		throw error;
	}
}

export const reportProduct = async ({
	product_id,
	message,
}: {
	product_id: string;
	message: string;
}) => {
	try {
		const response = await fetch(`${BASE_URL}/report_product`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ product_id, message }),
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('add produit favorit error :', error);
		throw error;
	}
};
