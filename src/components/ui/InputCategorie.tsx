import { validField } from '@/lib/utils';
import { FieldOptionsType } from '@/services/api/product_categorie';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { ChangeEvent, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { useFirstMountState } from 'react-use';
export default function InputCategorie({ item, valueSave }: { item: FieldOptionsType[0] , valueSave?: string | number | undefined}) {
	const { name, placeholder, type, require, icon, default: defaultValue } = item;
	const isFirstMount = useFirstMountState();
	const { valueInput, setValueInputs, errorInput, setErrorInputs } = useInputCategorie(
		(state) => state
	);
	useEffect(() => {
		if (require) {
			setValueInputs({ [name]: type === 'number' ? 0 : '' });
		}

		if (isFirstMount) {
			setValueInputs({ [name]: valueSave || defaultValue });
		}
	}, []);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setErrorInputs({ [name]: '' });
		try {
			validField(item, { [name]: e.target.value });
		} catch (error) {
			setErrorInputs({ [name]: (error as Error).message });
		}
		setValueInputs({ [name]: type === 'number' ? e.target.valueAsNumber : e.target.value });
	};
	return (
		<div className="mt-4 w-full">
			<div>
				<span
					className={twMerge(
						`block text-sm font-medium text-slate-700 `,
						Boolean(require) && "after:ml-0.5 after:font-serif after:text-[.785rem] after:text-gray-500 after:content-['(obligatoire)']"
					)}
				>
					{name}
				</span>
				<div className="flex items-center space-x-2">
					{/* <img src={icon} alt="logo" className="size-8 text-gray-400" /> */}
					<input
						key={type + name}
						type={type}
						name={name}
						value={valueInput[name]}
						// value={valueInput[name]}
						onChange={handleChange}
						className={twMerge(
							`mt-1 flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`,
							errorInput?.[name] && 'border-red-500',
							type === 'number' && 'w-1/2'
						)}
						placeholder={placeholder}
					/>
				</div>
				{
					<p
						className={twMerge('text-red-500 text-xs h-3 opacity-0', errorInput?.[name] && 'opacity-100')}
					>
						{errorInput[name]}
					</p>
				}
			</div>
		</div>
	);
}
