import { formatDate } from '@/utils/formating';
import { products } from '@/utils/mock/product';
import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';

export default function ProductsPage() {
	return (
		<div className="mt-8 grid grid-cols-5 gap-1">
			<div className="col-start-1 col-end-5 gap-5">
				{products.map((product) => (
					<Link
						to={`/product/$productId`}
						params={{ productId: product._id }}
						key={product._id}
						className="my-2 grid h-[280px] grid-rows-12"
					>
						<div className="row-start-1  row-end-3 flex flex-row items-center  gap-x-2">
							<img src={product.avatar} className="size-7 rounded-full" alt="" />
							<span className="font-poppins text-xs">{product.fullName}</span>
						</div>
						<div className="row-start-3 row-end-13 border-b-[1px] border-slate-200">
							<div className="grid h-full grid-cols-12 gap-2 py-1 pl-1">
								<div
									className={`group relative col-start-1 col-end-6 flex justify-center rounded-md bg-slate-400 bg-cover bg-center bg-no-repeat`}
									style={{
										backgroundImage: `url(${product.images[0]})`,
										width: '100%',
										height: '100%',
									}}
									role="img"
									aria-label={product.brand}
								>
									{product.urgence && (
										<span className="absolute -top-7 right-1 -z-10 rounded-sm bg-slate-200 px-3 pb-[15px] pt-1 text-sm font-semibold text-lime-700 transition-all duration-200 ease-linear group-hover:-top-8">
											Urgent
										</span>
									)}
								</div>
								<div className="col-start-6 col-end-13 flex h-full flex-col gap-2 p-1">
									<div className="grid h-full  grid-cols-12 ">
										<div className="col-start-1 col-end-12 flex h-full flex-col items-start justify-between">
											<div className="flex flex-col gap-2">
												<span className="text-base font-semibold">{product.title}</span>
												<div className="flex flex-row items-center gap-1">
													<span className="text-sm font-semibold">{product.price} CFA</span>
													<span className=" px-1 font-sans text-xs font-light text-gray-900 shadow-sm">
														{product.statut}
													</span>
												</div>
											</div>
											<div className="flex flex-row items-center gap-x-1">
												<span className=" px-1 font-sans text-xs font-light text-gray-900 shadow-sm">
													{product.localisation}
												</span>
												<div className="size-[3px]  bg-black" />
												{product.urgence ? (
													<></>
												) : (
													<span className=" px-1 font-sans text-xs font-light text-gray-900 shadow-sm">
														{formatDate(product.date)}
													</span>
												)}
											</div>
										</div>
										<button
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												console.log(product);
											}}
											className="col-start-12 col-end-13 flex flex-col items-center justify-between hover:text-slate-600"
										>
											<Heart role="img" aria-label="heart" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</Link>
				))}
			</div>
			<div className="col-start-5"></div>
		</div>
	);
}
