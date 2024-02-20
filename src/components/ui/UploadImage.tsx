import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { Nbr_Image_Upload, URL_IMAGE } from '@/utils/constante';
import { X } from 'lucide-react';
import { memo, useCallback, useRef, useState } from 'react';
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
		<div className="mt-3 flex h-auto flex-row flex-wrap justify-center gap-3">
			{images.map((image, i) => {
				return (
					<div
						className={twMerge('h-[120px] w-[150px] cursor-grab  overflow-hidden bg-slate-400/10')}
						key={i}
						draggable="true"
						onDragStart={() => handleDragStart(i)}
						onDragOver={() => handleDragOver(i)}
						onDragEnd={handleDragEnd}
						// onDragEnter={() => handleDragOver(i)}
					>
						<div
							className={`relative rounded-sm bg-contain bg-center bg-no-repeat object-contain`}
							style={{
								backgroundImage: `url(${typeof image === 'string' ? URL_IMAGE + image : image.buffer})`,
								width: '100%',
								height: '100%',
							}}
							role="img"
							aria-label={'image preview'}
						>
							<X
								className="absolute right-1 top-1 z-10 cursor-pointer rounded-full bg-white/20 p-[1px] text-red-700"
								onClick={() => removeFiles(i)}
								size={20}
							/>
							<span className="absolute bottom-1 right-1 bg-black/50 px-1 text-xs font-bold text-white">
								{i + 1}/{Nbr_Image_Upload}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	);
});
