import { ProviderType } from '@/services/api/product_categorie';
import { useCreateDiscussionMutaton } from '@/utils/queryOptions';
import { Loader2, MessageSquareText, Phone } from 'lucide-react';
import React from 'react';

export default function ContactProvider({ provider }: { provider: ProviderType }) {
	return (
		<div className="flex flex-col gap-y-2 p-5">
			<p>Contactez via :</p>
			{provider.phone && (
				<a
					href={`https://api.whatsapp.com/send?phone=+225${provider.phone}&text=${encodeURIComponent(shareText)}%20${encodeURIComponent(shareUrl)}`}
					target="_blank"
					rel="noreferrer"
					className={`flex items-center gap-x-2 rounded-md bg-slate-600 px-8 py-2 text-white`}
				>
					<img
						src={'/img/whatsapp.png'}
						alt=""
						className={`size-7 bg-cover bg-center bg-no-repeat text-white`}
					/>
					Whatsapp
				</a>
			)}

			<a
				href={'tel:+225' + provider.phone}
				className="flex gap-x-2 rounded-md bg-green-600 px-8 py-2 text-white"
			>
				<Phone color="white" />
				Telephone
			</a>
			<button onClick={handleCreateMessage} className={`flex gap-x-2 rounded-md bg-primary px-8 py-2`}>
				<MessageSquareText color="white" />
				<span className={` text-white`}>Message direct</span>
				{isPending && <Loader2 color="white animate-spin" />}
			</button>
		</div>
	);
}
