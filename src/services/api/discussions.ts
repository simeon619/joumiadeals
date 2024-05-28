import { z } from 'zod';
import { getHeaders, getHeadersWithFormData } from '../state/User/auth';
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
	// acl_id: z.string().nullable(),
	created_at: z.string(),
	updated_at: z.string(),
});

const ProductSchema = z.object({
	id: z.string(),
	title: z.string(),
	price: z.number(),
	description: z.string(),
	status: z.string(),
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
	discussion_id: z.string(),
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
const MessageSchema = z.object({
	id: z.string(),
	text: z.string(),
	files: z.string().transform((data) => JSON.parse(data) as string[]),
	account_id: z.string(),
	discussion_id: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

const ResponseSchema = z.object({
	total: z.number(),
	messages: z.array(MessageSchema),
});
export const getMessages = async (page = 1, discussion_id: string | undefined) => {
	if (!discussion_id) return { total: 0, messages: [] };
	console.log(page, discussion_id);

	const response = await fetch('http://localhost:3000/get_messages', {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({ limit: 16, page, discussion_id }),
	});
	const data = await response.json();
	const messages = ResponseSchema.safeParse(data);
	if (!messages.success) {
		throw new Error(messages.error.message);
	}
	return messages.data;
};
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
const getMessageSchema = z.object({
	id: z.string(),
	text: z.string(),
	discussion_id: z.string(),
	files: z.array(z.string()),
	account_id: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

export const sendMessage = async ({
	text,
	discussion_id,
	files,
}: {
	text?: string;
	discussion_id: string | undefined;
	files?: File | null;
}) => {
	if (!discussion_id) return;
	const formData = new FormData();
	if (text) {
		formData.append('text', text);
	}
	formData.append('discussion_id', discussion_id);
	// files?.forEach((file, index) => {
	// });
	if (files) {
		formData.append(`files_${0}`, files, `file_${0}.${files.type.split('/')[1]}`);
	}
	const response = await fetch(`${BASE_URL}/send_message`, {
		method: 'POST',
		headers: getHeadersWithFormData(),
		body: formData,
	});
	if (!response.ok) {
		throw new Error("Erreur lors de l'envoi du message");
	}
	const data = await response.json();
	const messages = getMessageSchema.safeParse(data);
	if (!messages.success) {
		throw new Error(messages.error.message);
	}
	return messages.data;
};

const MessageCreateSchema = z.object({
	id: z.string(),
	client_id: z.string(),
	provider_id: z.string(),
	product_id: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

//   type MessageCreateType = z.infer<typeof MessageCreateSchema>;

export const createDiscussion = async ({ product_id }: { product_id: string }) => {
	const response = await fetch(`${BASE_URL}/create_discussion`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({ product_id }),
	});

	if (!response.ok) {
		throw new Error('Erreur lors de la création de la discussion');
	}
	const data = await response.json();
	const discussion = MessageCreateSchema.safeParse(data);
	if (!discussion.success) {
		throw new Error(discussion.error.message);
	}
	return discussion.data;
};
