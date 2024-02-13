import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

export default function SelectComponent({
	values,
	setValues,
    label,
	defaultValue
}: {
	values: (string | number)[];
	setValues: React.Dispatch<React.SetStateAction<string>>;
    label: string,
	defaultValue?: string
}) {
	return (
		<div className="mt-5 w-full">
			<span className="block text-sm font-medium text-slate-700 after:ml-0.5 after:text-red-500 after:content-['*']">
				{label}
			</span>
			<Select name="city" defaultValue={defaultValue} onValueChange={(value) => setValues(value)}>
				<SelectTrigger className="mt-1 flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-blue focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue sm:text-sm">
					<SelectValue placeholder={values[0]} />
				</SelectTrigger>
				<SelectContent className="bg-white">
					{values.map((value) => (
						<SelectItem className="font-poppins focus:bg-blue" key={value} value={String(value)}>
							{value}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
