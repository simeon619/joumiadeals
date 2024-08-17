import ActionFavourite from '@/components/ui/ActionFavourite';
import { formatPrice } from '@/lib/utils';
import { ProductsMinType } from '@/services/api/product_categorie';
import { formatDate } from '@/utils/formating';
import { Link } from '@tanstack/react-router';
import ImgComponent from './componentAdd/ImgComponent';

export default function LayoutMini({ products }: { products: ProductsMinType }) {
	return (
		<div className="flex flex-row flex-wrap items-center justify-center gap-x-14  overflow-x-auto">
			{products.map((product) => {
				return (
					<Link
						to={`/product/$productId`}
						color="gray"
						params={{ productId: product.product_id }}
						key={product.product_id}
						className="my-1 flex min-w-[190px] max-w-[200px] snap-center flex-col items-start gap-x-2 rounded-md border-x border-b border-slate-50  py-1"
					>
						<ImgComponent photos={product.photos} title={product.title} style="w-[190px] h-[170px]" />
						<div className="flex w-full flex-col items-start bg-slate-50 p-1">
							<span className="line-clamp-2 font-roboto text-sm text-slate-800">{product.title}</span>
							<span className="py-2 font-roboto text-sm text-slate-900">
								{formatPrice(Number(product.price))}
							</span>
							<ActionFavourite
								productId={product.product_id}
								style="flex flex-row items-center justify-center gap-1 text-white"
							/>

							<div className="mt-5 flex flex-col gap-y-1">
								<span className="text-xs text-slate-900">{product.location}</span>
								<span className="text-xs font-bold text-slate-500">
									{' '}
									{formatDate(product.product_created_at)}
								</span>
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
