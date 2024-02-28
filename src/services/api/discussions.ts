import { z } from 'zod';
import { getHeaders } from '../state/User/auth';
import { ToastError } from '@/lib/utils';
import { BASE_URL } from '@/utils/constante';


const AccountSchema = z.object({
	id: z.string(),
	name: z.string(),
	location: z.string(),
	email: z.string().email(),
	use_whatsapp: z.number(),
	avatar_url: z.string().url(),
	access_id: z.string(),
	phone: z.string(),
	acl_id: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
  });
  
  const ProductSchema = z.object({
	id: z.string(),
	title: z.string(),
	price: z.number(),
	description: z.string(),
	status: z.number(),
	photos: z.string().transform((data) => JSON.parse(data) as string[]),
	express_time: z.string().nullable(),
	last_appearance: z.string().nullable(),
	caracteristique: z.string(),
	moderator_id: z.string().nullable(),
	category_id: z.string(),
	account_id: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
  });
  
  const DiscussionSchema = z.object({
	provider: AccountSchema,
	client: AccountSchema,
	product: ProductSchema,
	discussion_id: z.string()
  });
  
  const DiscussionsSchema = z.array(DiscussionSchema);

  export type DiscussionSchemaType = z.infer<typeof DiscussionSchema>;

export const getDiscussions = async () => {
	const response = await fetch('http://localhost:3000/get_discussions', {
		method: 'POST',
		headers: getHeaders(),
	});
	const data = await response.json();
	const discussions = DiscussionsSchema.safeParse(data);
	if (!discussions.success) {
		ToastError(discussions.error.message);
		throw new Error(discussions.error.message);

	}
	return discussions.data;
};

export  const getMessages = async ({limit = 35, page = 1}) => {
	const response = await fetch('http://localhost:3000/get_messages', {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({limit, page}),
	});
	const data = await response.json();
	const messages = DiscussionsSchema.safeParse(data);
	if (!messages.success) {
		throw new Error(messages.error.message);
	}
	return messages.data;
}
// export async function createProduct(data: {
// 	dataProduct: Record<string, any>;
// 	photos: (
// 		| string
// 		| {
// 				file: File;
// 				buffer: string;
// 		  }
// 	)[];
// }) {
// 	const { dataProduct, photos } = data;
// 	const formData = new FormData();
// 	for (const key in dataProduct) {
// 		formData.append(key, dataProduct[key]);
// 	}
// 	photos.forEach((photo, index) => {
// 		if (typeof photo !== 'string')
// 			formData.append(
// 				`photos_${index}`,
// 				photo.file,
// 				`photo_${index}.${photo.file.type.split('/')[1]}`
// 			);
// 	});
// 	try {
// 		const response = await fetch(`${BASE_URL}/create_product`, {
// 			method: 'POST',
// 			headers: getHeadersWithFormData(),
// 			body: formData,
// 		});

// 		if (!response.ok) {
// 			throw new Error('Erreur lors de la création du produit');
// 		}
// 		const data = await response.json();
// 		console.log('Données du produit créé :', data);
// 		return data;
// 	} catch (error) {
// 		console.error('Erreur lors de la création du produit :', error);
// 		throw error;
// 	}
// }

export const sendMessage = async ({text, discussion_id, files} : { text: string, discussion_id: string, files?: File[]}) => {
	const formData = new FormData();
	formData.append('text', text);
	formData.append('discussion_id', discussion_id);
	files?.forEach((file, index) => {
		formData.append(`files_${index}`, file, `file_${index}.${file.type.split('/')[1]}`);
	});
	const response = await fetch(`${BASE_URL}/send_messages`, {
		method: 'POST',
		headers: getHeaders(),
		body: formData,
	});
	const data = await response.json();
	const messages = DiscussionsSchema.safeParse(data);
	if (!messages.success) {
		throw new Error(messages.error.message);
	}
	return messages.data;
}

