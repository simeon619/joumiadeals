/* eslint-disable @typescript-eslint/no-explicit-any */
import { field_annonce, getStatusByLevel } from '@/lib/utils';
import { BASE_URL, LimitItemPaginate } from '@/utils/constante';
import { LIMIT_PRODUCT_PAGE, RequestFilterProductType } from '@/utils/queryOptions';
import { z } from 'zod';
import { getHeaders, getHeadersWithFormData, useAuth } from '../state/User/auth';
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

export const f_form_min_schema = z.object({
	collect_type: z.enum(['number', 'select', 'radio', 'boolean', 'date', 'text', 'textarea', 'file']),
	feature_id: z.string(),
	name: z.string(),
	required: z.number().int().min(0).max(1).optional(),
	placeholder: z.string().optional(),
	default_value: z.union([z.string(), z.number()]).optional(),
	icon: z.string().optional(),
	ext: z.string().max(3).optional(),
	min: z.number().optional(),
	max: z.number().optional(),
	match: z.any().optional(),
	created_at: z.string().optional(),
	category_id: z.string().optional(),
	enum: z.union([z.array(z.string()), z.array(z.number())]).optional(),
});
export type f_form_type = z.infer<typeof f_form_min_schema>;

const CategorySchema = z.array(
	z.object({
		id: z.string(),
		label: z.string(),
		icon: z.string().nullable(),
		parent_category_id: z.string().nullable(),
		is_parentable: z.number(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
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

export async function getFeaturesCategory({ category_id }: { category_id: string | null }) {
	if (!category_id) return [];
	try {
		const response = await fetch(`${BASE_URL}/get_features`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ category_id }),
		});
		const data = await response.json();
		console.log('🚀 ~ data:', data);
		const validationResult = z.array(f_form_min_schema).safeParse(data);
		if (!validationResult.success) {
			throw new Error(validationResult.error.message);
		}
		return validationResult.data;
	} catch (error) {
		console.error('Erreur lors de la création de la catégorie :', error);
		throw error;
	}
}

export async function getAllFeatures() {
	try {
		const response = await fetch(`${BASE_URL}/get_features`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({}),
		});
		const data = await response.json();
		// console.log('🚀 ~ data:', data);
		const validationResult = z.array(f_form_min_schema).safeParse(data);
		if (!validationResult.success) {
			throw new Error(validationResult.error.message);
		}
		return validationResult.data;
	} catch (error) {
		console.error('Erreur lors de la création de la catégorie :', error);
		throw error;
	}
}
const FeatureValueSchema = z.array(
	z.object({
		value: z.string(),
		name: z.string(),
		feature_id: z.string(),
	})
);
export async function get_feature_values_product({
	product_id,
}: {
	product_id: string | undefined;
}) {
	if (!product_id) return [];
	try {
		const response = await fetch(`${BASE_URL}/get_f_values_product`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ product_id }),
		});
		const data = await response.json();
		const validationResult = FeatureValueSchema.safeParse(data);
		if (!validationResult.success) {
			throw new Error(validationResult.error.message);
		}
		return validationResult.data;
	} catch (error) {
		console.error('Erreur lors de la création de la catégorie :', error);
		throw error;
	}
}

const mapKeyForProductServer = (key: string) => {
	switch (key) {
		case field_annonce[0]:
			return 'title';
		case field_annonce[1]:
			return 'price';
		case field_annonce[2]:
			return 'description';
		default:
			return key;
	}
};

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
		let value = dataProduct[key];
		if (key === 'featuresProduct') value = JSON.stringify(dataProduct[key]);
		if (key == 'price') value = Number(value);

		const k = mapKeyForProductServer(key);

		formData.append(k, value);
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
		const data = await response.json();
		console.log('🚀 ~ data:', data);
		if (!response.ok) {
			throw new Error(data.message);
		}
		console.log('Données du produit créé :', data);
		return data;
	} catch (error) {
		console.error('Erreur lors de la création du produit :', error);
		throw error;
	}
}
export async function updateProduct(dataUpdate: {
	dataProduct: Record<string, any>;
	photos: (
		| string
		| {
				file: File;
				buffer: string;
		  }
	)[];
}) {
	const { dataProduct, photos } = dataUpdate;
	const formData = new FormData();
	for (const key in dataProduct) {
		let value = dataProduct[key];
		if (key === 'featuresProduct') value = JSON.stringify(dataProduct[key]);
		if (key == 'price') value = Number(value);
		const k = mapKeyForProductServer(key);
		formData.append(k, value);
	}

	const phots = photos.map((photo, index) => {
		if (typeof photo !== 'string') {
			return `photos_${index}`;
		} else return photo;
	});
	formData.append('photos', JSON.stringify(phots));
	photos.forEach((photo, index) => {
		if (typeof photo !== 'string') {
			formData.append(
				`photos_${index}`,
				photo.file,
				`photo_${index}.${photo.file.type.split('/')[1]}`
			);
		}
	});
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
const statusSchema = z.enum(['AWAIT', 'VALID', 'REJECTED', 'DELETED', 'PAUSE']);
export type StatusType = z.infer<typeof statusSchema>;
const ProductMinSchema = z.object({
	avatar_url: z.string(),
	photos: z.array(z.string()),
	price: z.number(),
	provider_name: z.string(),
	provider_id: z.number(),
	location: z.string(),
	category_id: z.string(),
	express_time: z.string().nullable(),
	description: z.string(),
	title: z.string(),
	status: statusSchema,
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
// export async function getProductsByFiltr(requestData: RequestDataType) {
// 	console.log("🚀 ~ getProductsByFiltr ~ requestData:", requestData)
// 	const response = await fetch(`${BASE_URL}/filter_product`, {
// 		method: 'POST',
// 		headers: getHeaders(),
// 		body: JSON.stringify({ ...requestData, limit: LIMIT_PRODUCT_PAGE }),
// 	});
// 	const data = await response.json();
// 	console.log("🚀 ~ getProductsByFiltr ~ data:", data)
// 	const products = ProductShemaPaginate.safeParse(data);
// 	if (!products.success) {
// 		console.log(products.error);
// 		throw new Error(products.error.message);
// 	}
// 	return products.data;
// }

export async function getProducts(requestData: RequestFilterProductType) {
	const response = await fetch(`${BASE_URL}/filter_product`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({
			...requestData,
			filter: {
				...requestData.filter,
				status: getStatusByLevel(requestData.filter?.status),
				category_id: requestData.filter?.category_id === 'all' ? null : requestData.filter?.category_id,
			},
			limit: LIMIT_PRODUCT_PAGE,
		}),
	});
	const data = await response.json();
	const products = ProductShemaPaginate.safeParse(data);
	if (!products.success) {
		throw new Error(products.error.message);
	}
	return products.data;
}

const ProviderSchema = z.object({
	id: z.number(),
	name: z.string(),
	location: z.string(),
	email: z.string().email(),
	use_whatsapp: z.number(),
	avatar_url: z.string().url(),
	phone: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type ProviderType = z.infer<typeof ProviderSchema>;

const ProductDetailSchema = z.object({
	id: z.string(),
	title: z.string(),
	price: z.number(),
	description: z.string(),
	status: z.enum(['AWAIT', 'VALID', 'REJECTED', 'DELETED', 'PAUSE']),
	photos: z.array(z.string()),
	express_time: z.nullable(z.string()),
	last_appearance: z.nullable(z.string()),
	moderator_id: z.nullable(z.number()),
	category_id: z.string(),
	account_id: z.number(),
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
	console.log('🚀 ~ deleteProduct ~ data:', data);
	if (!data.isDeleted) {
		throw new Error('Erreur lors de la suppression du produit');
	}
}

const IdSchemaProduct = z.array(z.string());

export async function getFavouriteProductsId() {
	if (!useAuth.getState().isAuth) return [];
	try {
		const response = await fetch(`${BASE_URL}/get_all_favorite_products_id`, {
			method: 'POST',
			headers: getHeaders(),
		});
		const data = await response.json();
		if (!Array.isArray(data)) return [];
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
export const pageSchema = z
	.object({ page: z.number(), limit: z.number().optional() })
	.default({ page: 1, limit: LimitItemPaginate });
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
const VisitedShemaPaginate = z.object({
	visited: ProductsDataSchema,
	total: z.number(),
});
export const addVisitedProduct = async ({ product_id }: { product_id: string }) => {
	try {
		const response = await fetch(`${BASE_URL}/add_visited_product`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ product_id }),
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('add produit favorit error :', error);
		throw error;
	}
};

export const getVisitedProducts = async ({ page }: { page: number }) => {
	try {
		const response = await fetch(`${BASE_URL}/get_visited_products`, {
			method: 'POST',
			headers: getHeaders(),
			body: JSON.stringify({ limit: LIMIT_PRODUCT_PAGE, page }),
		});
		const data = await response.json();
		const products = VisitedShemaPaginate.safeParse(data);
		console.log('🚀 ~ getVisitedProducts ~ products:', products);
		if (!products.success) {
			console.log(products.error);
			throw new Error(products.error.message);
		}
		return products.data;
	} catch (error) {
		console.error('recuperation id produit favorit error :', error);
		throw error;
	}
};
export async function updateProductStatus(dataUpdate: {
	product_id: string;
	status: StatusType;
	comment: string;
}) {
	try {
		const response = await fetch(`${BASE_URL}/update_product_status`, {
			method: 'PUT',
			headers: getHeaders(),
			body: JSON.stringify({ ...dataUpdate }),
		});

		if (!response.ok) {
			const text = await response.json();
			console.log(text.message);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		// console.error("Erreur lors de la mise a jour du statut du produit", error);
		// throw error;
	}
}
