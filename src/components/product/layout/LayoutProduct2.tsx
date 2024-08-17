import { capitalizeFirstLetter, formatPrice } from '@/lib/utils';
import { ProductsData } from '@/services/api/product_categorie';
import { formatDate } from '@/utils/formating';
import { Link } from '@tanstack/react-router';
import ActionFavourite from '../../ui/ActionFavourite';
import FeatureComponent from '../FeatureComponent';
import ImgComponent from './componentAdd/ImgComponent';

export default function LayoutProduct2({ products }: { products: ProductsData['products'] }) {
	return (
		<div className="w-full  ">
			{products.map((product) => (
				<ItemProduct key={product.product_id} product={product} />
			))}
		</div>
	);
}

const ItemProduct = ({ product }: { product: ProductsData['products'][0] }) => {
	return (
		<Link
			to={`/product/$productId`}
			key={product.product_id}
			color="gray"
			params={{ productId: product.product_id }}
			className="group mt-2 flex max-w-[80%] flex-col  border-b-[1px] border-slate-300 bg-slate-100/10 px-1 py-3 hover:bg-slate-100/20"
		>
			<div className="flex flex-row items-center gap-x-2 rounded-xl bg-slate-100/20 p-1 ">
				<img src={product.avatar_url} loading="lazy" className="size-7 rounded-full" alt="" />
				<span className="font-poppins text-xs">{product.provider_name}</span>
			</div>
			<div className="flex flex-1 flex-col  border-slate-200">
				<div className="flex w-full flex-1 gap-2  pl-1">
					<ImgComponent photos={product.photos} title={product.title} style="w-[39%] h-[210px]">
						<ActionFavourite productId={product.product_id} style="absolute top-1 right-1 " />
					</ImgComponent>

					<div className="flex w-full flex-1 flex-row items-stretch justify-between gap-2 px-1 group-hover:rounded-2xl">
						<div className="flex size-full flex-col justify-between">
							<div className="flex flex-col gap-y-4">
								<div className="flex flex-col gap-y-2">
									<span className="font-roboto text-[1.175rem] font-semibold text-slate-900 transition-all duration-200 ease-linear group-hover:text-primary">
										{capitalizeFirstLetter(product.title)}
									</span>
									<span className="text-[.975rem] font-bold text-slate-900">
										{formatPrice(product.price)}
									</span>
								</div>
								<FeatureComponent productId={product.product_id} />
							</div>
							<div className="flex flex-row items-center gap-x-1 font-poppins">
								<span className="px-1 text-xs font-light text-gray-900">{product.location}</span>
								<div className="size-[3px] bg-gray-600" />
								{product.express_time ? (
									<></>
								) : (
									<span className="px-1 text-xs font-light text-gray-600">
										{formatDate(product.product_created_at)}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
};
