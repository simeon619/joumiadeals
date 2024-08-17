import { CategoryType } from '@/services/api/product_categorie';
import { getCategorieById } from '@/utils/mock/Menucaegorie';
import clsx from 'clsx';

export default function suggestCat({
	stepC,
	categories,
	collectFeatures,
	fieldSelect,
}: {
	stepC: string[];
	fieldSelect: string;
	categories: CategoryType;
	collectFeatures: (Ids: string[]) => void;
}) {
	return (
		<button
  onClick={() => collectFeatures(stepC.reverse())}
  className={clsx(
    'm-3 inline-flex transform-cpu items-center justify-center gap-1 rounded-lg bg-blue-200 p-1 font-roboto transition-all duration-300 ease-in-out hover:scale-105 hover:font-BlackOpsOne hover:shadow-2xl'
  )}
>
  {stepC.reverse().map((catId, index) => {
    return (
      <div key={index} className={clsx('inline-flex items-center justify-center gap-1')}>
        <span className={clsx('text-[.705rem] capitalize')}>
          {getCategorieById(catId, categories)?.label}
        </span>
        <div
          className={clsx('size-1 rounded-full bg-black transition-opacity duration-300 ease-in-out', {
            'opacity-0': index === stepC.length - 1,
            'opacity-100': index !== stepC.length - 1,
          })}
        />
      </div>
    );
  })}
</button>
	);
}
