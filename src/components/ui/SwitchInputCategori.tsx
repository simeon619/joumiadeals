import { FieldOptionsType } from '@/services/api/product_categorie';
import { Switch } from '@/components/ui/switch';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { useEffect } from 'react';
import { twMerge } from 'tailwind-merge';

export default function SwitchInputCategori({ item }: { item: FieldOptionsType[0] }) {
	const { valueInput, setValueInputs } = useInputCategorie((state) => state);

	const { name, require ,default : defaultValue } = item;

	useEffect(() => {
		if (require) {
			setValueInputs({ [name]: 0 });
		}
	}, []);

	const handleChange = (val: boolean) => {
		setValueInputs({ [name]: val ? 1 : 0 });
	};
	return (
		<div className="mt-5 w-full">
			<div>
				<span
					className={twMerge(
						`block text-sm font-medium text-slate-700 `,
						Boolean(require) && "after:ml-0.5 after:text-red-500 after:content-['*']"
					)}
				>
					{name}
				</span>
				<Switch checked={!!valueInput[name]} defaultChecked={defaultValue ? true : false} onCheckedChange={handleChange} />
			</div>
		</div>
	);
}
