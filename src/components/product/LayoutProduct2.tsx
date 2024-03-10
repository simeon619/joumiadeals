import { ProductsData } from '@/services/api/product_categorie';
import { URL_IMAGE } from '@/utils/constante';
import { formatDate } from '@/utils/formating';
import { Link } from '@tanstack/react-router';
import ActionFavourite from '../ui/ActionFavourite';
import { formatPrice } from '@/lib/utils';

export default function LayoutProduct2({ product }: { product: ProductsData['products'][0] }) {
	return (
		<Link
			to={`/product/$productId`}
			color='gray'
			params={{ productId: product.product_id }}
			// replace={false}
			// key={product.product_id}
			className="group my-2 grid h-[260px] grid-rows-12"
		>
			<div className="row-start-1 row-end-3 flex flex-row items-center  gap-x-2">
				<img src={product.avatar_url} className="size-7 rounded-full" alt="" />
				<span className="font-poppins text-xs">{product.name}</span>
			</div>
			<div className="row-start-3 row-end-13 border-b-[1px] border-slate-200">
				<div className="grid h-full grid-cols-12 gap-2 py-1 pl-1">
					<div
						className={`group relative col-start-1 col-end-5 flex justify-center rounded-md bg-slate-400 bg-cover bg-center bg-no-repeat`}
						style={{
							backgroundImage: `url(${URL_IMAGE}${product.photos[0]})`,
							width: '100%',
							height: '100%',
						}}
						role="img"
						// aria-label={product.brand}
					>
						{/* {product.urgence && (
						<span className="absolute -top-7 right-1 -z-10 rounded-sm bg-slate-200 px-3 pb-[15px] pt-1 text-sm font-semibold text-lime-700 transition-all duration-200 ease-linear group-hover:-top-8">
							Urgent
						</span>
					)} */}
					</div>
					<div className="col-start-5 col-end-13 flex h-full flex-col gap-2 p-1">
						<div className="grid h-full  grid-cols-12 ">
							<div className="col-start-1 col-end-12 flex h-full flex-col items-start justify-between">
								<div className="flex flex-col gap-y-2">
									<span className="text-[.975rem] font-semibold text-slate-900 group-hover:text-primary">
										{product.title}
									</span>
									<span className="text-[.975rem] font-bold text-slate-900">
										{formatPrice(product.price)}
									</span>
								</div>
								<div className="flex gap-x-5">
									{Object.keys(product.caracteristique)
										.slice(0, 4)
										.map((key) => {
											return (
												<span className="flex flex-col items-start justify-center text-xs" key={key}>
													<span className="text-xs capitalize text-gray-500">{key}</span>
													<span className="text-[.8rem] font-light capitalize text-gray-900">
														{product.caracteristique[key]}
													</span>
												</span>
											);
										})}
								</div>
								<div className="flex flex-row items-center gap-x-1">
									<span className=" px-1 font-sans text-xs font-light text-gray-900">
										{product.location}
									</span>
									<div className="size-[3px]  bg-black" />
									{product.express_time ? (
										<></>
									) : (
										<span className=" px-1 font-sans text-xs font-light text-gray-900">
											{formatDate(product.product_created_at)}
										</span>
									)}
								</div>
							</div>
							<ActionFavourite
								productId={product.product_id}
								style="col-start-12 col-end-13 flex flex-col items-center justify-between hover:text-slate-600"
							/>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
