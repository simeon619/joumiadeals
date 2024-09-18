import { getFeatureProductOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function FeatureComponent({
	productId,
	nbrFeature = 4,
}: {
	productId: string;
	nbrFeature?: number;
}) {
	const { data: features } = useSuspenseQuery(getFeatureProductOptions(productId));
	return (
		<div className="flex w-[70%] flex-wrap justify-between gap-4 font-poppins lg:w-[100%] lg:justify-stretch lg:gap-0">
			{features.slice(0, nbrFeature).map((feature, index) => (
				<div key={index} className={`flex flex-col rounded-lg`}>
					<span className="text-[.7rem] font-bold text-black lg:hidden">{feature.name}</span>
					<span className="inline text-[.75rem] text-gray-900 lg:text-[.85rem] lg:after:px-1 lg:after:content-['•']">
						{feature.value}
					</span>
				</div>
			))}
		</div>
	);
}
