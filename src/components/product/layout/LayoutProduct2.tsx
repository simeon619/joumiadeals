import { productsRoot } from '@/lib/route';
import { capitalizeFirstLetter, formatPrice } from '@/lib/utils';
import { ProductsData } from '@/services/api/product_categorie';
import { formatDate } from '@/utils/formating';
import { getCategorieById } from '@/utils/mock/Menucaegorie';
import { getAllChildCategoriesOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import ActionFavourite from '../../ui/ActionFavourite';
import FeatureComponent from '../FeatureComponent';
import ImgComponent from './componentAdd/ImgComponent';

export default function LayoutProduct2({ products }: { products: ProductsData['products'] }) {
	const { data: categories } = useSuspenseQuery(getAllChildCategoriesOptions());
	const search = productsRoot.useSearch();
	return (
		<div className="w-full  ">
			<div className="flex w-full flex-col items-start justify-start gap-2 p-4">
				<h1 className="text-start font-roboto text-lg">
					Annonce {getCategorieById(search.filter.category_id, categories)?.label} : Toute la Cote
					d&apos;ivoire
				</h1>
				<h5 className="text-start font-roboto text-slate-500 ">{products.length} annonces</h5>
			</div>
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
			className="group my-2 flex max-w-[80%] flex-col rounded-lg border-[1px] border-slate-300 bg-slate-100/10 pb-3 transition-all duration-200 ease-linear hover:bg-slate-100/20"
		>
			<Link
				to={'/o_profile/announceOther'}
				search={{ provider_id: product.provider_id, filter: { status: 5 } }}
				className="mb-[1px] flex flex-row items-center gap-x-2 rounded-t-lg border bg-white p-1 shadow-sm transition-all duration-200 ease-linear hover:border-primary hover:bg-slate-100"
			>
				<img src={product.avatar_url} loading="lazy" className="size-7 rounded-full" alt="" />
				<span className="font-poppins text-xs">{product.provider_name}</span>
			</Link>
			<div className="flex flex-1 flex-col  border-slate-200">
				<div className="flex w-full flex-1 gap-2">
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
