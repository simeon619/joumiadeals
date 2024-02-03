import { MenuCat } from '@/utils/Menucaegorie';
import clsx from 'clsx';
import {
	Baby,
	Bike,
	Briefcase,
	CarFront,
	Home,
	Layers3,
	Shirt,
	Smartphone,
	Sofa,
} from 'lucide-react';
import { useState } from 'react';
const SIZE_ICON = 20;
export default function CategoriseMenu() {
	const [data, setData] = useState(
		MenuCat['vehicules']
	);
	const [estSurvole2, setEstSurvole2] =
		useState('');

	const iconKeys = {
		immobilier: (
			<Home
				size={SIZE_ICON}
				strokeWidth={2}
				absoluteStrokeWidth
			/>
		),
		vehicules: (
			<CarFront
				size={SIZE_ICON}
				strokeWidth={2}
				absoluteStrokeWidth
			/>
		),
		motos: (
			<Bike
				size={SIZE_ICON}
				strokeWidth={2}
				absoluteStrokeWidth
			/>
		),
		emploi: (
			<Briefcase
				size={SIZE_ICON}
				strokeWidth={2}
				absoluteStrokeWidth
			/>
		),
		mode: (
			<Shirt
				size={SIZE_ICON}
				strokeWidth={2}
				absoluteStrokeWidth
			/>
		),
		'maisons & jardin': (
			<Sofa
				size={32}
				strokeWidth={2}
				absoluteStrokeWidth
			/>
		),
		famille: (
			<Baby
				size={SIZE_ICON}
				strokeWidth={2}
				absoluteStrokeWidth
			/>
		),
		electronique: (
			<Smartphone
				size={SIZE_ICON}
				strokeWidth={2}
				absoluteStrokeWidth
			/>
		),
		Loisirs: (
			<Bike
				size={SIZE_ICON}
				strokeWidth={2}
				absoluteStrokeWidth
			/>
		),
		Autres: (
			<Layers3
				size={SIZE_ICON}
				strokeWidth={2}
				absoluteStrokeWidth
			/>
		),
	};

	return (
		<>
			<div
				onMouseLeave={() => {
					// setEstSurvole2('');
				}}
				className="flex justify-between py-2"
			>
				{Object.keys(MenuCat).map(
					(Categorie, i, arr) => (
						<span
							key={Categorie}
							className="relative flex items-center justify-center px-4"
						>
							<span
								onMouseEnter={() => {
									setEstSurvole2(Categorie);
									setData(MenuCat[Categorie]);
								}}
								className={clsx(
									'cursor-pointer text-sm font-semibold capitalize text-slate-700',
									estSurvole2 === Categorie
										? 'relative font-semibold text-black'
										: ''
								)}
							>
								{Categorie}
								{estSurvole2 === Categorie && (
									<span className="absolute -bottom-1 left-0 h-[2px] w-full bg-black"></span>
								)}
							</span>

							<span
								className={clsx(
									i !== arr.length - 1 &&
										'ml-2 size-[2px] rounded-full bg-blue'
								)}
							/>
						</span>
					)
				)}
			</div>

			{estSurvole2 && (
				<div
					onMouseLeave={() => setEstSurvole2('')}
					className="absolute max-h-full w-[75rem] overflow-hidden rounded-md border-[1px]
					 bg-white px-5 shadow-lg before:w-10 before:bg-red-500 before:content-['']"
				>
					<div className="mr-5 flex flex-row content-start font-poppins">
						<div className="flex w-1/6 items-center justify-center gap-x-3 bg-slate-100 p-6">
							{iconKeys[estSurvole2]}
							<span className="inline-block text-center text-base capitalize text-black">
								{estSurvole2}
							</span>
						</div>
						<div className="flex max-h-[500px] flex-col flex-wrap content-start gap-x-6 gap-y-2 pl-4 ">
							{Object.keys(data).map(
								(Categorie) => (
									<div
										key={Categorie}
										className="p-2 first:last:max-w-none"
									>
										<span className="inline-block cursor-pointer text-sm font-bold capitalize text-black hover:text-blue">
											{Categorie}
										</span>
										<span>
											{data[Categorie].map(
												(item) => (
													<span
														key={item}
														className="block cursor-pointer text-wrap py-1 text-sm font-semibold capitalize text-slate-500 hover:text-blue"
													>
														{item}
													</span>
												)
											)}
										</span>
									</div>
								)
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
