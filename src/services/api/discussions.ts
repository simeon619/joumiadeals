import { ToastError } from '@/lib/utils';
import { BASE_URL } from '@/utils/constante';
import { z } from 'zod';
import { getHeaders, getHeadersWithFormData } from '../state/User/auth';

export const ITEM_PER_PAGE = 20;

const AccountSchema = z.object({
	id: z.number(),
	name: z.string(),
	location: z.string(),
	email: z.string().email(),
	useWhatsapp: z.number(),
	avatarUrl: z.string(),
	// access_id: z.string(),
	phone: z.string(),
	// acl_id: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

const ProductSchema = z.object({
	id: z.string(),
	title: z.string(),
	price: z.number(),
	description: z.string(),
	status: z.string(),
	photos: z.string().transform((data) => JSON.parse(data) as string[]),
	expressTime: z.string().nullable(),
	lastAppearance: z.string().nullable(),
	moderator_id: z.string().nullable().optional(),
	categoryId: z.string(),
	accountId: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
const MessageSchema = z.object({
	id: z.string(),
	text: z.string(),
	files: z.string().transform((data) => JSON.parse(data) as string[]),
	accountId: z.number(),
	discussionId: z.number(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type MessageSchemaType = z.infer<typeof MessageSchema>;

const DiscussionSchema = z.object({
	provider: AccountSchema.optional(),
	client: AccountSchema.optional(),
	product: ProductSchema.optional(),
	account: AccountSchema.optional(),
	lastMessage: z.object({ text: z.string(), createdAt: z.string() }).optional().nullable(),
	discussion_id: z.number(),
});

const DiscussionsSchema = z.array(DiscussionSchema);

export type DiscussionSchemaType = z.infer<typeof DiscussionSchema>;
const OrderBy = z.enum(['date_desc', 'date_asc', 'price_desc', 'price_asc']);

export const FilterDiscussionSchema = z.object({
	filter: z.object({
		order_by: OrderBy.optional(),
		text: z.string().optional(),
		type: z.enum(['provider', 'product', 'private']),
	}),
	page: z.number().optional(),
	provider_id: z.number().optional(),
	product_id: z.string().optional(),
});

export const filterDiscussionPrivateSchema = z.object({
	discussion_id: z.number(),
});

export type FilterDiscussionType = z.infer<typeof FilterDiscussionSchema>;

export const getDiscussions = async (request: FilterDiscussionType) => {
	const response = await fetch(`${BASE_URL}/get_discussions`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({ ...request, limit: 6 }),
	});
	const data = await response.json();
	const discussions = z
		.object({
			total: z.number(),
			results: DiscussionsSchema,
		})
		.safeParse(data);
	if (!discussions.success) {
		ToastError(discussions.error.message);
		throw new Error(discussions.error.message);
	}
	return discussions.data;
};

const ResponseSchema = z.object({
	total: z.number(),
	messages: z.array(MessageSchema),
});
export const getMessages = async ({
	page,
	discussion_id,
}: {
	page: number;
	discussion_id: number | undefined;
}) => {
	if (!discussion_id) return { total: 0, messages: [] };

	const response = await fetch(`${BASE_URL}/get_messages`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({ limit: ITEM_PER_PAGE, page, discussion_id }),
	});

	const data = await response.json();
	const result = ResponseSchema.safeParse(data);
	if (!result.success) {
		throw new Error(result.error.message);
	}

	return result.data;
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
	account_id: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
});

export const checkUnreadMessages = async (discussion_id: number) => {
	const response = await fetch(`${BASE_URL}/check_unread_messages`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({ discussion_id }),
	});
	const data = await response.json();
	const result = z.number().safeParse(data);
	if (!result.success) {
		throw new Error(result.error.message);
	}
	return result.data;
};
export const checkAllUnreadMessages = async () => {
	const response = await fetch(`${BASE_URL}/check_all_unread_messages`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({}),
	});
	const data = await response.json();
	const result = z.number().safeParse(data);
	if (!result.success) {
		throw new Error(result.error.message);
	}
	return result.data;
};
export const markAsRead = async (discussion_id: number) => {
	const response = await fetch(`${BASE_URL}/mark_as_read`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({ discussion_id }),
	});
	const data = await response.json();
	const result = z.boolean().safeParse(data);
	if (!result.success) {
		throw new Error(result.error.message);
	}
	return result.data;
};
export const sendMessage = async ({
	text,
	discussion_id,
	files,
}: {
	text?: string;
	discussion_id: number | undefined;
	files?: File | null;
}) => {
	if (!discussion_id) return;
	const formData = new FormData();
	if (text) {
		formData.append('text', text);
	}
	formData.append('discussion_id', discussion_id.toString());
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
	const data = await response.json();
	console.log('🚀 ~ data:', data);
	if (!response.ok) {
		throw new Error("Erreur lors de l'envoi du message");
	}
	const messages = getMessageSchema.safeParse(data);
	if (!messages.success) {
		throw new Error(messages.error.message);
	}
	return messages.data;
};

const MessageCreateSchema = z.object({
	id: z.number(),
	client_id: z.number(),
	provider_id: z.number(),
	product_id: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

//   type MessageCreateType = z.infer<typeof MessageCreateSchema>;

export const createDiscussion = async ({
	product_id,
	type,
	account_id,
}: {
	product_id: string;
	type: 'personal' | 'product';
	account_id: number;
}) => {
	const response = await fetch(`${BASE_URL}/create_discussion`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify({ product_id, type, account_id }),
	});

	if (!response.ok) {
		throw new Error('Erreur lors de la création de la discussion');
	}
	const data = await response.json();
	console.log('🚀 ~ data:', data);
	const discussion = MessageCreateSchema.safeParse(data);
	if (!discussion.success) {
		throw new Error(discussion.error.message);
	}
	return discussion.data;
};
