import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { useEffect, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
export default function SelectCategorie({
	values,
	label,
	defaultValue,
	required,
	placeholder,
	id,
	isfeature,
}: {
	values: (string | number)[];
	label: string;
	defaultValue?: string | number | undefined | null;
	required?: boolean;
	placeholder?: string;
	id: string;
	isfeature: boolean;
}) {
	const { setDataProduct, setDataProductFeature } = useInputCategorie((state) => state);
	const nameId = useMemo(() => (id ? `${label}:${id}` : `${label}`), []);
	const handleChange = (value: string) => {
		if (isfeature) {
			setDataProductFeature({
				[nameId]: value,
			});
		} else {
			setDataProduct({
				[nameId]: value,
			});
		}
	};
	useEffect(() => {
		if (required) {
			if (isfeature) {
				setDataProductFeature({
					[nameId]: null,
				});
			} else {
				setDataProduct({
					[nameId]: null,
				});
			}
		}
		if (defaultValue) {
			if (isfeature) {
				setDataProductFeature({
					[nameId]: defaultValue,
				});
			} else {
				setDataProduct({
					[nameId]: defaultValue,
				});
			}
		}
	}, []);

	return (
		<div className="mt-5 w-full">
			<span
				className={twMerge(
					`block text-sm font-medium text-slate-700 `,
					Boolean(required) &&
						"after:ml-0.5 after:text-[.785rem] after:font-serif after:text-gray-500 after:content-100 after:content-['(obligatoire)']"
				)}
			>
				{label}
			</span>
			<Select name={label} onValueChange={handleChange} >
				<SelectTrigger className="mt-1 rounded-md border border-slate-300 bg-white p-1 text-xs text-gray-600 shadow-sm  hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary">
					<SelectValue placeholder={values[0]} />
				</SelectTrigger>
				<SelectContent className="rounded-2xl bg-white">
					{values?.map((value, i) => {
						if (i === 0) return null;
						return (
							<SelectItem
								className="text-sm capitalize text-gray-700 focus:bg-blue-100"
								key={i}
								value={String(value)}
							>
								{value}
							</SelectItem>
						);
					})}
				</SelectContent>
			</Select>
		</div>
	);
}
