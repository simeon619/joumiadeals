import { getFeatureProductOptions } from '@/utils/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';

export default function FeatureComponent({ productId }: { productId: string }) {
	const { data: features } = useSuspenseQuery(getFeatureProductOptions(productId));
	return (
		<div className="flex w-full flex-wrap justify-start gap-x-4 font-poppins">
			{features.slice(0, 4).map((feature, index) => (
				<div key={index} className="flex flex-col rounded-lg p-1">
					<span className="text-[.78rem] text-black">{feature.name}</span>
					<span className=" text-[.80rem] text-gray-500">{feature.value}</span>
				</div>
			))}
		</div>
	);
}
