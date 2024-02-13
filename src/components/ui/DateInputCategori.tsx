import { validField } from '@/lib/utils';
import { FieldOptionsType } from '@/services/api/product_categorie';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { ChangeEvent, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export default function DateInputCategori({ item }: { item: FieldOptionsType[0] }) {
	const { valueInput, setValueInputs, errorInput, setErrorInputs } = useInputCategorie(
		(state) => state
	);
	const { name, placeholder, type, require, icon } = item;
	useEffect(() => {
		if (require) {
			setValueInputs({ [name]: '' });
		}
	}, []);
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setErrorInputs({ [name]: '' });
		try {
			validField(item, { [name]: e.target.value });
		} catch (error) {
			setErrorInputs({ [name]: (error as Error).message });
		}
		setValueInputs({ [name]: e.target.value });
	};
	return (
		<div className="mt-5 w-full">
			<span
				className={twMerge(
					`block text-sm font-medium text-slate-700 `,
					require && "after:ml-0.5 after:text-red-500 after:content-['*']"
				)}
			>
				{name}
			</span>
			<div className="flex items-center space-x-2">
				<img src={icon} alt="logo" className="size-8 text-gray-400" />
				<input
					type={type}
					name={name}
					value={valueInput[name]}
					onChange={handleChange}
					className="mt-1 flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-blue focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue sm:text-sm"
					placeholder={placeholder}
				/>
			</div>
			{errorInput[name] && <p className="text-red-500">{errorInput[name]}</p>}
		</div>
	);
}
