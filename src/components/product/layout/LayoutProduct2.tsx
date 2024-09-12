/* eslint-disable @typescript-eslint/no-explicit-any */
import { productsOtherRoot } from '@/lib/route';
import { capitalizeFirstLetter, formatPrice, getUrlImage } from '@/lib/utils';
import { ProductsData } from '@/services/api/product_categorie';
import { useSearchFilter } from '@/services/state/App/filterState';
import { formatDate } from '@/utils/formating';
import { getCategorieById } from '@/utils/mock/Menucaegorie';
import { getAllChildCategoriesOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import ActionFavourite from '../../ui/ActionFavourite';
import FeatureComponent from '../FeatureComponent';
import ImgComponent from './componentAdd/ImgComponent';

export default function LayoutProduct2({
	products,
	componentRoot,
}: {
	products: ProductsData['products'];
	componentRoot?: any;
}) {
	const { data: categories } = useSuspenseQuery(getAllChildCategoriesOptions());
	const search = componentRoot?.useSearch();
	const filterFrom = useSearchFilter((state) => state.value);

	return (
		<div className="w-full">
			<div className="flex w-full flex-col items-start justify-start gap-2 p-4">
				<h1 className="text-start font-roboto text-lg">
					Annonce {getCategorieById(search.filter.category_id, categories)?.label} :{' '}
					{filterFrom.location ? filterFrom.location : "Toute la Cote d'ivoire"}
				</h1>
				<h5 className="text-start font-roboto text-slate-500 ">{products.length} annonces</h5>
			</div>
			{products.map((product) => (
				<ItemProduct key={product.product_id} product={product} componentRoot={componentRoot} />
			))}
		</div>
	);
}

const ItemProduct = ({
	product,
	componentRoot,
}: {
	product: ProductsData['products'][0];
	componentRoot?: any;
}) => {
	const navigate = useNavigate({ from: componentRoot.fullPath }) as any;
	return (
		<Link
			to={`/product/$productId`}
			key={product.product_id}
			params={{ productId: product.product_id }}
			className={clsx(
				'group my-2 mb-8 flex max-w-[850px] flex-col border-b-[1px] border-gray-500 bg-slate-100/10 pb-5 transition-all duration-200 ease-linear hover:bg-slate-100/20'
			)}
		>
			<button
				onClick={(e) => {
					navigate({
						search: () => ({
							filter: {
								status: 5,
							},
							provider_id: product.provider_id,
						}),
						to: productsOtherRoot.to,
					});
					e.preventDefault();
					e.stopPropagation();
				}}
				// to={'/o_profile/announceOther'}
				// search={{ provider_id: product.provider_id, filter: { status: 5 } }}
				className={clsx(
					'mb-[1px] flex flex-row items-center gap-x-2 rounded-t-lg  bg-white p-1 transition-all duration-200 ease-linear hover:border-primary hover:bg-slate-100',
					{
						hidden: componentRoot.fullPath.includes('o_profile'),
					}
				)}
			>
				<img
					src={getUrlImage(product.avatar_url)}
					loading="lazy"
					className="size-7 rounded-full"
					alt=""
				/>
				<span className="font-poppins text-xs">{product.provider_name}</span>
			</button>
			<div className="flex flex-1 flex-col">
				<div className="flex w-full flex-1 gap-2">
					<ImgComponent photos={product.photos} title={product.title} style="w-[310px] h-[210px]">
						<ActionFavourite productId={product.product_id} style="absolute top-1 right-1 " />
					</ImgComponent>

					<div className="flex w-full flex-1 flex-row items-stretch justify-between gap-2 px-1 group-hover:rounded-2xl">
						<div className="flex size-full flex-col justify-between">
							<div className="flex flex-col gap-y-4">
								<div className="flex flex-col gap-y-2">
									<span className="line-clamp-1 font-roboto text-[.975rem] font-semibold text-slate-900 transition-all duration-200 ease-linear group-hover:text-primary">
										{capitalizeFirstLetter(product.title)}
									</span>
									<span className="text-[.905rem] font-bold text-slate-900">
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
