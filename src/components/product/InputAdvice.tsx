import { capitalize } from '@/lib/utils';

export const InputAdvice = ({ advices = [] }: { advices?: string[] }) => {
	return (
		<div className={'border-b-[1px] border-l-[1px] bg-slate-50 py-2'}>
			{advices.map((advice, i) => {
				return (
					<span
						className={`flex items-center text-[.695rem] font-bold text-blue-400  before:m-1 before:inline-block before:size-1 before:rounded-full before:bg-blue-500 before:content-['']`}
						key={i.toString()}
					>
						{capitalize(advice)}
					</span>
				);
			})}
		</div>
	);
};
