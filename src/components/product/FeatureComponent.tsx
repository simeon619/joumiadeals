import { getFeatureProductOptions } from "@/utils/queryOptions";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function FeatureComponent({ productId }: { productId : string }) {
    const { data: features } = useSuspenseQuery(getFeatureProductOptions(productId));
  return (
    <div className="flex flex-row gap-6 text-[.68rem]">
    {features.slice(0, 4).map((feature, index) => (
        <div
            key={index}
            className="flex flex-col rounded-lg p-1"
        >
            <span className="font-semibold text-gray-800">{feature.name}</span>
            <span className=" text-gray-600">{feature.value}</span>
        </div>
    ))}
</div>
  )
}
