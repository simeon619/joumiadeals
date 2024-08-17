/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '@/services/state/User/auth';
import { BASE_URL } from '@/utils/constante';
import { Transmit } from '@adonisjs/transmit-client';
import { queryClient } from './route';

export const transmit = new Transmit({
	baseUrl: BASE_URL,
});

const checkMsg = async (data: { discussionId: string }) => {
	const { discussionId } = data;
	await queryClient.invalidateQueries({ queryKey: ['getUnreadMessages', Number(discussionId)] });
	await queryClient.invalidateQueries({ queryKey: ['getAllUnreadMessages'] });
};

export const initTransmit = async () => {
	const checkMsgUnread = transmit.subscription(`1/unreadMsg/${useAuth.getState().InfoUser.id}`);
	await checkMsgUnread.create();
	const stopCheckMsgUnread = checkMsgUnread.onMessage(checkMsg);
	transmit.on('disconnected', () => {
		stopCheckMsgUnread();
	});
	transmit.on('connected', async () => {
		await checkMsgUnread.create();
	});
};
