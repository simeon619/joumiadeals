/* eslint-disable @typescript-eslint/no-explicit-any */
import { HTMLInputTypeAttribute } from 'react';
import { twMerge } from 'tailwind-merge';

export default function InputComponent({
	register,
	errors,
	label,
	type,
	name,
	placeholder,
	defaultValue,
}: {
	register: any;
	errors: any;
	label: string;
	type: HTMLInputTypeAttribute;
	name: string;
	placeholder: string;
	defaultValue?: string;
}) {
	return (
		<div className="mt-2  w-full">
			<div>
				<span className="block text-sm font-medium text-slate-700 after:ml-0.5 after:text-gray-500 after:content-['*']">
					{label}
				</span>
				<input
					type={type}
					{...register(name)}
					name={name}
					defaultValue={defaultValue}
					className={twMerge(
						`mt-1 flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-blue focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue sm:text-sm`,
						errors?.[name] && 'border-red-500',
						type === 'number' && 'w-1/2'
					)}
					placeholder={placeholder}
				/>
				{
					<p className={twMerge(errors?.[name] ? 'text-xs text-red-300' : 'text-red-50/0', 'h-3')}>
						{errors?.[name]?.message}
					</p>
				}
			</div>
		</div>
	);
}
