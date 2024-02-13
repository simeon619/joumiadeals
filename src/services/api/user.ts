import { BASE_URL, headers } from '@/utils/constante';
import { z } from 'zod';
const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	location: z.string(),
	email: z.string().email(),
	avatar_url: z.string().url(),
	phone: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;


export async function getAcount   ({ accountId }: { accountId: string }) {
	const response = await fetch(`${BASE_URL}/get_account`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({ id: accountId }),
	});
	const data = await response.json();
	const infoUser = UserSchema.safeParse(data);
	if (!infoUser.success) {
		console.log(infoUser.error);
		throw new Error(infoUser.error.message);
	}
	return infoUser.data;
};
