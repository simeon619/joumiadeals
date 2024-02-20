/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDropzone } from 'react-dropzone';
import { useCallback, useMemo, useState } from 'react';
import { Image } from 'lucide-react';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { ToastError } from '@/lib/utils';
import UploadImage from './UploadImage';
import { Nbr_Image_Upload } from '@/utils/constante';
export default function InputFileComponent({
	max = Nbr_Image_Upload,
	maxSize = 12 * 1024 * 1024,
	name,
}: {
	max?: number;
	maxSize?: number;
	name: string;
}) {
	const setFilesData = useInputCategorie((state) => state.setFilesData);
	const files = useInputCategorie((state) => state.filesData);
	
	const images = useMemo(
		() =>
			files.map((file) => {
				if (file instanceof File) {
					return URL.createObjectURL(file);
				}
				return file;
			}),
		[files]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			'image/jpeg': [],
			'image/jpg': [],
			'image/webp': [],
		},
		noClick: false,
		multiple: true,
		maxFiles: max || Nbr_Image_Upload,
		maxSize: 12 * 1024 * 1024,

		onDrop: (acceptedFiles: Array<File>) => {
			const file = new FileReader();
			file.onloadend = function () {
				if (!acceptedFiles[0].type.includes('image'))
					return ToastError("Le format de l'image n'est pas autorisé");
				if (acceptedFiles[0].size > maxSize) return ToastError("La taille de l'image est trop grande");
				if(acceptedFiles.length > max) return ToastError("Le nombre d'image est trop important");
				if(file.result === null) return ToastError("Une erreur est survenue lors de l'envoi du fichier");
				setFilesData({ buffer: file.result.toString(), file: acceptedFiles[0] }, Nbr_Image_Upload);
			};
			file.readAsDataURL(acceptedFiles[0]);
		},
		onError: (e) => {
			console.log(e);
			ToastError("Une erreur est survenue lors de l'envoi du fichier");
		},
	});
	return (
		<div className="my-2  w-full">
			<div {...getRootProps()}>
				<span className="block py-1 text-sm font-medium text-slate-700 after:ml-0.5 after:text-gray-500 after:content-['*']">
					{name}
				</span>
				<input
					{...getInputProps({
						role: 'button',
						'aria-label': 'drag and drop area',
						accept: 'image/jpg, image/jpeg , image/webp',
					})}
				/>
				{isDragActive ? (
					<div className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dotted border-slate-400 bg-slate-200 py-2 text-center ">
						Deposer ici
						{files.length === 0 && <Image />}
					</div>
				) : (
					<div className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dotted border-slate-400 bg-slate-200 py-2 text-center ">
						Glisser et deposer vos images ou cliquez ici
						{files.length === 0 && <Image />}
					</div>
				)}
			</div>
			<UploadImage images={images} />
		</div>
	);
}
