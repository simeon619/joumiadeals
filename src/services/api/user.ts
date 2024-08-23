/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL, headers } from '@/utils/constante';
import { z } from 'zod';
const UserSchema = z.object({
	id: z.number(),
	name: z.string(),
	location: z.string(),
	email: z.string().email(),
	avatar_url: z.string().url(),
	phone: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

export type UserType = z.infer<typeof UserSchema>;

export async function getAcount({ accountId }: { accountId: number }) {
	const response = await fetch(`${BASE_URL}/get_account`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({ account_id: accountId }),
	});
	const data = await response.json();
	console.log("🚀 ~ getAcount ~ data:", data)
	const infoUser = UserSchema.safeParse(data);
	if (!infoUser.success) {
		console.log(infoUser.error);
		throw new Error(infoUser.error.message);
	}
	return infoUser.data;
}

export async function toggleLike({
	id,
	type,
	value,
}: {
	id: any;
	type: 'account' | 'message';
	value: -1 | 1;
}) {
	const response = await fetch(`${BASE_URL}/toggle_like`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({ id, type, value }),
	});
	const data = await response.json();
	const validationResult = z.number().safeParse(data);
	if (!validationResult.success) {
		throw new Error(validationResult.error.message);
	}
	return validationResult.data;
}

export async function getMyLike({ id, type }: { id: number; type: 'account' | 'message' }) {
	const response = await fetch(`${BASE_URL}/get_like`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({ id, type }),
	});
	const data = await response.json();
	const validationResult = z
		.object({ mylike: z.number(), totalLikes: z.number(), totalVotes: z.number() })
		.safeParse(data);
	if (!validationResult.success) {
		throw new Error(validationResult.error.message);
	}
	return validationResult.data;
}
