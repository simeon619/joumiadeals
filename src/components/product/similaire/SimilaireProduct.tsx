import { formatPrice } from '@/lib/utils';
import { URL_IMAGE } from '@/utils/constante';
import { formatDate } from '@/utils/formating';
import { getProductsOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { MoveLeftIcon, MoveRightIcon } from 'lucide-react';
import { useRef, useState } from 'react';

export default function SimilaireProduct({ categoryId }: { categoryId: string }) {
	const scrollableRef = useRef<HTMLDivElement>(null);

	const scrollLeft = () => {
		if (scrollableRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollableRef.current;

			if (scrollLeft === 0) {
				// Si on est au début, sauter à la fin
				scrollableRef.current.scrollLeft = scrollWidth - clientWidth;
			} else {
				scrollableRef.current.scrollBy({
					left: -200, // Défiler vers la gauche
					behavior: 'smooth',
				});
			}
		}
	};

	// Fonction pour défiler vers la droite avec boucle infinie
	const scrollRight = () => {
		if (scrollableRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollableRef.current;

			if (scrollLeft + clientWidth >= scrollWidth) {
				// Si on est à la fin, sauter au début
				scrollableRef.current.scrollLeft = 0;
			} else {
				scrollableRef.current.scrollBy({
					left: 200, // Défiler vers la droite
					behavior: 'smooth',
				});
			}
		}
	};
	const { data: similaireProducts, isPending } = useSuspenseQuery(
		getProductsOptions({
			page: 1,
			filter: { status: 5, category_id: categoryId },
		})
	);
	return (
		<div className=" my-5 border-t-[1px] border-slate-200 pt-5">
			<div className="flex items-center justify-between gap-x-2 p-2">
				<span className="text-sm text-slate-800">Annonces similaires</span>
			</div>
			<div className="flex w-full items-center justify-between gap-x-2 pt-2">
				<MoveLeftIcon
					onClick={scrollLeft}
					size={28}
					className="cursor-pointer rounded-full border bg-slate-50 p-1 text-slate-900 shadow-xl hover:text-gray-900"
				/>
				<MoveRightIcon
					onClick={scrollRight}
					size={28}
					className="cursor-pointer rounded-full border bg-slate-50 p-1 text-slate-900 shadow-xl hover:text-gray-900"
				/>
			</div>
			<div
				ref={scrollableRef}
				className="flex snap-x snap-proximity flex-row gap-1 overflow-x-auto scroll-smooth"
			>
				{similaireProducts.products.map((product) => {
					return (
						<Link
							to={`/product/$productId`}
							color="gray"
							params={{ productId: product.product_id }}
							key={product.product_id}
							className="flex  min-w-[190px] max-w-[200px] snap-center flex-col items-start gap-x-2  p-2"
						>
							<ImgComp photos={product.photos} title={product.title} />
							<span className="line-clamp-2  font-roboto text-sm text-slate-800">{product.title}</span>
							<span className="py-2 font-roboto text-sm text-slate-900">
								{formatPrice(Number(product.price))}
							</span>

							<div className="mt-5 flex flex-col gap-y-1">
								<span className="text-xs text-slate-900">{product.location}</span>
								<span className="text-xs font-bold text-slate-500">
									{' '}
									{formatDate(product.product_created_at)}
								</span>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
}

const ImgComp = ({ photos, title }: { photos: string[]; title: string }) => {
	const [isLoading, setIsLoading] = useState(true);

	const handleImageLoad = () => {
		setIsLoading(false);
	};
	return (
		<div className="relative w-full">
			{isLoading && (
				<div className="absolute inset-0 flex items-center justify-center">
					<div
						style={{
							border: '4px solid rgba(255, 255, 255, 0.2)',
							borderTopColor: 'rgba(255, 255, 255, 0.8)',
						}}
						className=" inline-block size-8 animate-spin rounded-full border-4 border-t-transparent text-gray-200"
					></div>
				</div>
			)}
			<img
				src={URL_IMAGE + photos[0]}
				alt={title || 'Image du produit'}
				className={`h-[170px] w-full rounded-sm border object-cover transition-all duration-500 ${
					isLoading ? 'blur-sm' : 'blur-0'
				}`}
				loading="lazy"
				onLoad={handleImageLoad}
				onError={(e) => {
					e.currentTarget.src = '/img/imgError.png';
				}}
			/>
		</div>
	);
};
