import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { Nbr_Image_Upload, URL_IMAGE } from '@/utils/constante';
import { X } from 'lucide-react';
import { memo, useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';
type Files = (
	| string
	| {
			file: File;
			buffer: string;
	  }
)[];

export default memo(function UploadImage({ images }: { images: Files }) {
	const removeFiles = useInputCategorie((state) => state.removeFile);
	const files = useInputCategorie((state) => state.filesData);
	const setFile = useInputCategorie((state) => state.setFile);
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
	const handleDragStart = (index: number) => {
		setDraggedIndex(index);
	};

	const handleDragOver = useCallback(
		(index: number) => {
			if (index !== draggedIndex) {
				const newFiles = [...files];
				const draggedFile = newFiles[draggedIndex || 0];
				newFiles.splice(draggedIndex || 0, 1);
				newFiles.splice(index, 0, draggedFile);
				setFile(newFiles);
				setDraggedIndex(index);
			}
		},
		[draggedIndex]
	);

	const handleDragEnd = () => {
		setDraggedIndex(null);
	};
	return (
		<div className="mt-3 flex h-auto flex-row flex-wrap justify-start gap-3">
			{images.map((image, i) => {
				return (
					<div
						className={twMerge(
							'relative h-[120px] w-[155px] cursor-grab overflow-hidden bg-slate-400/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500'
						)}
						key={i}
						tabIndex={0} // Rend l'élément focusable au clavier
						draggable="true"
						onDragStart={() => handleDragStart(i)}
						onDragOver={() => handleDragOver(i)}
						onDragEnd={handleDragEnd}
						role="button"
						aria-pressed={draggedIndex === i}
						aria-label={`Image preview ${i === 0 ? 'photo principale' : `image ${i + 1} de ${Nbr_Image_Upload}`}`}
					>
						<div
							className={` rounded-sm bg-cover bg-center bg-no-repeat object-contain`}
							style={{
								backgroundImage: `url(${typeof image === 'string' ? URL_IMAGE + image : image?.buffer})`,
								width: '100%',
								height: '100%',
							}}
							role="img"
							aria-label={'image preview'}
						>
							<X
								className="absolute -right-0  cursor-pointer rounded-full bg-gray-800 p-[1px] text-red-700"
								onClick={() => removeFiles(i)}
								size={20}
							/>
							<span className="absolute bottom-1  left-1 z-20 bg-black/50 px-1 text-xs font-bold text-white">
								{i === 0 ? 'photo principale' : i + 1 + '/' + Nbr_Image_Upload}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
});
