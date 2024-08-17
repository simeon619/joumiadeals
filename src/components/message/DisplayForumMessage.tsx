/* eslint-disable @typescript-eslint/no-explicit-any */
import { transmit } from '@/lib/transmit';
import { ITEM_PER_PAGE, MessageSchemaType } from '@/services/api/discussions';
import { getMessagesQueryOptions } from '@/utils/queryOptions';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import ItemMessage from './ItemMessage';

export default function DisplayForumMessage({ discussionId }: { discussionId: number }) {
	const [messages, setMessages] = useState<MessageSchemaType[]>([]);
	const [totalMessages, setTotalMessages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	const {
		data: getMessages,
		isPending,
		isLoading,
		isError,
	} = useQuery(getMessagesQueryOptions({ discussion_id: discussionId, page: currentPage }));

	const handleMessage = (data: any) => {
		setMessages((prevMessages) => [data, ...prevMessages]);
		setTotalMessages((prev) => prev + 1);
	};

	useEffect(() => {
		setMessages([]);
		setTotalMessages(getMessages?.total || 0);
		setMessages(getMessages?.messages || []);
		setTotalPages(Math.ceil((getMessages?.total || 0) / ITEM_PER_PAGE));
	}, [discussionId, getMessages?.messages, getMessages?.total]);

	useEffect(() => {
		setCurrentPage(1);
	}, [discussionId]);

	useEffect(() => {
		const init = async () => {
			const subscription = transmit.subscription(`1/discussion/${discussionId}`);
			await subscription.create();
			subscription.onMessage(handleMessage);
		};
		init();
	}, [discussionId]);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	if (isLoading) {
		return <div>Recuperation des messages...</div>;
	}

	if (isError) {
		return <div>Erreur lors de la récupération des messages</div>;
	}

	return (
		<div className="rounded-lg bg-gray-100 p-2  shadow-md">
			<span className="text-sm font-bold text-gray-700">{totalMessages} messages</span>
			{isPending && <div className="text-xs text-gray-500">Chargement des messages...</div>}
			<div className="mt-4 space-y-4">
				{messages.map((message) => (
					<ItemMessage key={message.id} message={message} />
				))}
			</div>
			<div className="mt-4 flex justify-center pb-20 pt-5 ">
				<button
					className="mx-1 rounded bg-blue-500 px-2 py-1 text-white disabled:opacity-50"
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					<ArrowLeftCircle size={16} strokeWidth={1.8} />
				</button>
				<span className="px-2 py-1 text-xs">{` ${currentPage} de ${totalPages}`}</span>
				<button
					className="mx-1 rounded bg-blue-500 px-2 py-1 text-white disabled:opacity-50"
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					<ArrowRightCircle size={16} strokeWidth={1.8} />
				</button>
			</div>
		</div>
	);
}
