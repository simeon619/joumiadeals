import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
export default function SelectCategorieCategorie({
	values,
	label,
	defaultValue,
	require,
}: {
	values: (string | number)[];
	label: string;
	defaultValue?: string;
	require?: boolean;
}) {
	const { setValueInputs } = useInputCategorie((state) => state);
	const handleChange = (value: string) => {
		setValueInputs({ [label]: value });
	};
	useEffect(() => {
		if (require) {
			setValueInputs({ [label]: values[0] });
		}
	}, []);

	return (
		<div className="mt-5 w-full">
			<span
				className={twMerge(
					`block text-sm font-medium text-slate-700 `,
					Boolean(require) && "after:ml-0.5 after:text-red-500 after:content-['*']"
				)}
			>
				{label}
			</span>
			<Select name={label} defaultValue={defaultValue} onValueChange={handleChange}>
				<SelectTrigger className="mt-1 flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm">
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
