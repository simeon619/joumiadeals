/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Textarea } from '@/components/ui/textarea';
import { twMerge } from 'tailwind-merge';
import { InputAdvice } from '../product/InputAdvice';

export default function TextAreaComponent({
	register,
	errors,
	label,
	// type,
	name,
	placeholder,
	defaultValue,
	advices,
}: {
	register: any;
	errors: any;
	label: string;
	name: string;
	placeholder: string;
	defaultValue?: string;
	advices?: string[];
}) {
	return (
		<div className="mt-5 w-full">
			<div>
				<span className="after:ml-0.5 after:font-serif after:text-[.785rem] after:text-gray-500 after:content-['(obligatoire)']">
					{label}
				</span>
				<textarea
					type={'text'}
					{...register(name)}
					rows="5"
					cols="33"
					name={name}
					defaultValue={defaultValue}
					className={twMerge(
						`mt-1 flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`,
						errors?.[name] && 'border-red-500'
					)}
					placeholder={placeholder}
				/>
				{
					<p className={twMerge(errors?.[name] && 'text-xs  text-red-300', 'h-3')}>
						{errors?.[name]?.message}
					</p>
				}
				{advices && <InputAdvice advices={advices} />}
			</div>
		</div>
	);
}
