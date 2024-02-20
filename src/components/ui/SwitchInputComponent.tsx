/* eslint-disable @typescript-eslint/no-explicit-any */
import { Switch } from '@/components/ui/switch';
import { RegisterSchemaType } from '@/pages/profile/index/MyprofilePage';
import { UseFormRegister } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

export default function SwitchInputComponent({
	register,
	errors,
	label,
	name,
	defaultValue,
}: {
	register: UseFormRegister<RegisterSchemaType>;
	errors: any;
	label: string;
	name: string;
	defaultValue?: number;
}) {
	return (
		<div className="w-full">
			<div>
				<span
					className={twMerge(
						`block text-sm font-medium text-slate-700 after:ml-0.5 after:text-slate-500 after:content-['*']`
					)}
				>
					{label || name}
				</span>
				<Switch
					{...register(name as keyof RegisterSchemaType, { setValueAs: (value) => (value ? 1 : 0) })}
					name={name}
					defaultChecked={Boolean(defaultValue)}
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
