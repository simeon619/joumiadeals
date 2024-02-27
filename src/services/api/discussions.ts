import { z } from 'zod';
import { getHeaders } from '../state/User/auth';
import { ToastError } from '@/lib/utils';


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
	photos: z.string().transform((data) => JSON.parse(data)),
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
	product: ProductSchema
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
