/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductsMinType } from '@/services/api/product_categorie';
import { URL_IMAGE } from '@/utils/constante';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import CloseModal from './CloseModal';
import PopUpComponent from './PopUpComponent';

const formulesub = [
	{
		id: 1,
		name: '1 jour',
		price: 500,
		description: 'votre annonce sera en urgence pendant 1 jour',
	},
	{
		id: 2,
		name: '3 jours',
		price: 1200,
		description: 'votre annonce sera en urgence pendant 7 jours',
	},
	{
		id: 3,
		name: '7 jours',
		price: 2500,
		description: 'votre annonce sera en urgence pendant 7 jours',
	},
];

export default function ModalBoostAnnouce({
	showPopUp,
	closePopUp,
	product,
}: {
	showPopUp: boolean;
	closePopUp: () => void;
	product: ProductsMinType[0];
}) {
	const [subSelect, setSubSelect] = useState(1);

	return (
		<PopUpComponent
			styleContainer="relative flex items-center size-full justify-center"
			isOpen={showPopUp}
			setHide={closePopUp}
		>
			<div className={`relative flex flex-col items-center justify-center gap-y-8 rounded-md bg-blue-50 p-4 `}>
				<div className={`h-[150px] w-[200px]`}>
					<CloseModal closePopUp={closePopUp} style="absolute right-4 top-4" />
					<div
						className={`rounded-md bg-slate-400 bg-cover bg-center bg-no-repeat`}
						style={{
							backgroundImage: `url(${URL_IMAGE}${product.photos[0]})`,
							width: '100%',
							height: '100%',
						}}
						role="img"
						aria-label={product.title}
					></div>
					<span className="text-center text-[.85rem] text-gray-900">{product.title}</span>
				</div>
				<div className="m-4 flex h-full flex-wrap items-center justify-center gap-8 font-gamjaflower">
					{formulesub.map((formule) => (
						<button
							key={formule.id}
							className={twMerge(
								'relative group flex max-w-[200px] h-[200px]  hover:border-blue-400 cursor-pointer flex-col items-center justify-center rounded-md border bg-slate-100 border-gray-300 p-4',
								subSelect === formule.id && ' border-blue-400 bg-blue-200 border-2'
							)}
							onClick={() => setSubSelect(formule.id)}
						>
							<h3 className="whitespace-pre-wrap break-words  text-2xl font-semibold capitalize text-black">
								{formule.name}
							</h3>
							<img
								src="/img/drapeau.png"
								alt="boost"
								className={twMerge(
									' transition-all duration-300 size-[0px]',
									subSelect === formule.id && 'size-[80px]'
								)}
							/>

							<p className="my-2 text-center font-sans text-[.8rem] text-black ">{formule.description}</p>
							<span className="absolute -bottom-6 rounded-md bg-yellow-500 px-2 text-2xl font-extrabold text-blue-100  transition-all duration-500 group-focus:scale-110 ">
								{formule.price} CFA
							</span>
						</button>
					))}
				</div>
				<button className="w-1/4 rounded-md bg-slate-500 p-2 text-white">Continue</button>
			</div>
		</PopUpComponent>
	);
}
