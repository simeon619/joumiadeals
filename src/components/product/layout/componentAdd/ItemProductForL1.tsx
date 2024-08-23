/* eslint-disable @typescript-eslint/no-explicit-any */
import ActionFavourite from '@/components/ui/ActionFavourite';
import { ProductsMinType } from '@/services/api/product_categorie';
import { Link } from '@tanstack/react-router';
import clsx from 'clsx';
import { Eye, MessageSquare, Share2 } from 'lucide-react';
import ContainAnnounceForL1 from './ContainAnnounceForL1';
import ImgComponent from './ImgComponent';
const size_icon = 15;

export default function ItemProductForL1({ product }: { product: ProductsMinType[0] }) {
	return (
		<div className="w-full">
			<Link
				to={`/product/$productId`}
				params={{ productId: product.product_id }}
				key={product.product_id}
				className={clsx(
					'group my-3 flex h-[240px] max-w-[80%] flex-col rounded-lg border-b-2 border-slate-100 p-1'
				)}
				draggable={false}
			>
				<div className="flex w-full flex-1 flex-col">
					<div className="flex size-full py-1 pl-1">
						<ImgComponent
							photos={product.photos}
							title={product.title}
							style={clsx('col-start-1 col-end-5 h-[210px] w-[40%]', {
								// 'opacity-70': product.status === 'AWAIT',
							})}
						>
							<>
								<ActionFavourite
									key={product.product_id}
									productId={product.product_id}
									style={clsx(
										'absolute  right-3 top-3 opacity-0 transition-all duration-300 group-hover:opacity-100 '
										// product.status === 'AWAIT' && 'hidden'
									)}
								/>
								<div className="absolute inset-x-0 bottom-0 flex justify-center gap-x-6 rounded-md bg-slate-950 font-sans opacity-0 transition-all duration-500  group-hover:opacity-100">
									<div
										title="nombre de vue sur l'annonce"
										className="flex flex-row items-center justify-center gap-1 text-white"
									>
										<span className="">0</span>
										<Eye size={size_icon} />
									</div>
									<div
										title="nombre de conversation sur l'annonce"
										className="flex flex-row items-center justify-center gap-1 text-white"
									>
										<span className="">0</span>
										<MessageSquare size={size_icon} />
									</div>
									<div
										title="nombre de partage sur l'annonce"
										className="flex flex-row items-center justify-center gap-1 text-white"
									>
										<span className="">0</span>
										<Share2 size={size_icon} />
									</div>
								</div>
							</>
						</ImgComponent>
						<ContainAnnounceForL1 product={product} />
					</div>
				</div>
			</Link>
		</div>
	);
}
