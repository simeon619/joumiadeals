/* eslint-disable @typescript-eslint/no-explicit-any */
import { validField } from '@/lib/utils';
import { f_form_type } from '@/services/api/product_categorie';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import clsx from 'clsx';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { useFirstMountState } from 'react-use';
import { twMerge } from 'tailwind-merge';
export default function InputCategorie({
	item,
	valueSave,
	isfeature,
}: {
	item: f_form_type;
	valueSave?: string | number | undefined | null;
	isfeature?: boolean;
}) {
	const { name, placeholder, required, collect_type, default_value, id } = item;
	const isFirstMount = useFirstMountState();
	const { setInputFocus } = useInputCategorie((state) => state);
	const {
		dataProduct,
		dataProductFeature,
		setDataProduct,
		setDataProductFeature,
		errorInput,
		setErrorInputs,
	} = useInputCategorie((state) => state);
	const nameId = useMemo(() => (id ? `${name}:${id}` : `${name}`), []);
	const value = useMemo(
		() => (isfeature ? dataProductFeature[nameId] : dataProduct[nameId]),
		[dataProduct, dataProductFeature, isfeature, nameId]
	);
	useEffect(() => {
		if (required) {
			if (isfeature) {
				setDataProductFeature({
					[nameId]: valueSave || default_value || null,
				});
			} else {
				setDataProduct({
					[nameId]: valueSave || default_value || null,
				});
			}
		}
		if (isFirstMount) {
			if (isfeature) {
				setDataProductFeature({
					[nameId]: valueSave || default_value,
				});
			} else {
				setDataProduct({
					[nameId]: valueSave || default_value,
				});
			}
		}
	}, [
		default_value,
		isFirstMount,
		required,
	]);

	const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setErrorInputs({ [nameId]: '' });
		try {
			validField(item, { [nameId]: collect_type === 'number' ? Number(e.target.value) : e.target.value });
		} catch (error) {
			setErrorInputs({ [nameId]: (error as Error).message });
		}
		if (isfeature) {
			setDataProductFeature({
				[nameId]:  collect_type === 'number' ? Number(e.target.value) : e.target.value,
			});
		} else {
			setDataProduct({
				[nameId]:  collect_type === 'number' ? Number(e.target.value) : e.target.value,
			});
		}
	};

	const handleFocus = () => {
		setInputFocus({ [nameId]: true });
	};

	const handleBlur = () => {
		setInputFocus({ [nameId]: false });
	};

	const inputProps = {
		className: twMerge(
			`flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`,
			errorInput?.[nameId] && 'border-red-500',
			collect_type === 'number' && 'w-1/2'
		),
	};
	return (
		<div className="mt-7 w-full">
			<div>
				<span
					className={twMerge(
						`block text-sm font-medium text-slate-700`,
						Boolean(required) &&
							"after:px-1 after:font-serif after:text-[.785rem] after:text-gray-500 after:content-['(obligatoire)']"
					)}
				>
					{name}
				</span>
				<div className="flex items-center ">
					{collect_type === 'textarea' ? (
						<textarea
							key={collect_type + name}
							onChange={handleChange}
							value={value === null ? '' : value}
							placeholder={placeholder}
							onFocus={handleFocus}
							onBlur={handleBlur}
							{...inputProps}
							rows={4}
							cols={4}
						/>
					) : (
						<input
							type={collect_type}
							onChange={handleChange}
							value={value === null ? '' : value}
							placeholder={placeholder}
							onFocus={handleFocus}
							onBlur={handleBlur}
							{...inputProps}
						/>
					)}
				</div>
				<div className=" flex justify-start">
					<span
						className={clsx('pr-2 font-roboto text-[.785rem]', errorInput?.[nameId] && 'text-red-500', {
							visible: collect_type.includes('text'),
							hidden: !collect_type.includes('text'),
						})}
					>
						{value?.toString().length || 0}/{item.max}
					</span>
					<p
						className={twMerge(
							'text-red-500 text-xs h-3 font-roboto ',
							errorInput?.[nameId] && 'opacity-100'
						)}
					>
						{errorInput[nameId]}
					</p>
				</div>
			</div>
		</div>
	);
}
