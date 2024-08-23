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
		<div className="flex w-full flex-wrap justify-start gap-4 font-poppins">
			{features.slice(0, nbrFeature).map((feature, index) => (
				<div key={index} className="flex flex-col rounded-lg p-1">
					<span className="text-[.7rem] font-bold text-black">{feature.name}</span>
					<span className=" text-[.75rem] text-gray-700">{feature.value}</span>
				</div>
			))}
		</div>
	);
}
