import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { twMerge } from 'tailwind-merge';

export default function SelectComponent({
	values,
	setValues,
	label,
	defaultValue,
	style,
}: {
	values: (string | number | undefined)[];
	setValues: React.Dispatch<React.SetStateAction<string | number | undefined>>;
	label: string;
	defaultValue?: string;
	style?: string;
}) {
	return (
		<div className={twMerge('w-full', style)}>
			<span className="block text-sm font-medium text-slate-700 after:ml-0.5 after:text-red-500 after:content-['*']">
				{label}
			</span>
			<Select name="city" defaultValue={defaultValue} onValueChange={(value) => setValues(value)}>
				<SelectTrigger className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm">
					<SelectValue placeholder={values[0]} />
				</SelectTrigger>
				<SelectContent className="bg-white">
					{values.map((value) => (
						<SelectItem className="font-poppins focus:bg-primary" key={value} value={String(value)}>
							{value}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
