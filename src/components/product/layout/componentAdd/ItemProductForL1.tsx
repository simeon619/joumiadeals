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
		<Link
			to={`/product/$productId`}
			params={{ productId: product.product_id }}
			key={product.product_id}
			className={clsx('group my-3 h-[100%]  rounded-lg  p-1')}
			draggable={false}
		>
			<div className="flex size-full items-stretch justify-start rounded-md border md:flex-col">
				<ImgComponent
					photos={product.photos}
					title={product.title}
					style={clsx('aspect-[4/3] h-[200px] w-[310px] sm:h-[200px] sm:w-[100%]', {})}
				>
					<>
						<ActionFavourite
							key={product.product_id}
							productId={product.product_id}
							style={clsx(
								'absolute right-3 top-3 opacity-0 transition-all duration-300 group-hover:opacity-100 '
								// product.status === 'AWAIT' && 'hidden'
							)}
						/>
					</>
				</ImgComponent>
				<ContainAnnounceForL1 product={product} />
			</div>
		</Link>
	);
}
