/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDropzone } from 'react-dropzone';
import { useEffect, useState } from 'react';
import { Image, X } from 'lucide-react';
import { useInputCategorie } from '@/services/state/App/inputStateCategorie';
import { ToastError } from '@/lib/utils';
export default function InputFileComponent({
	max,
	maxSize,
	name,
}: {
	max?: number;
	maxSize?: number;
	name: string;
}) {
	const [preview, setPreview] = useState<(string | ArrayBuffer)[]>([]);
	const setFilesData = useInputCategorie((state) => state.setFilesData);

	useEffect(() => {
		setFilesData(preview);
	}, [preview]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: {
			'image/jpeg': [],
			'image/jpg': [],
		},
		noClick: false,
		multiple: true,
		maxFiles: max || 5,
		maxSize: 12 * 1024 * 1024,
		onDrop: (acceptedFiles: Array<File>) => {
			const file = new FileReader();
			file.onload = function () {
				setPreview((prev) => {
					if (file.result === null) return prev;
					if (prev.length >= (max || 5)) {
						ToastError('Vous ne pouvez pas ajouter plus de fichiers');
						return prev;
					}

					return [...prev, file.result];
				});
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
						accept: 'image/jpg, image/jpeg',
					})}
				/>
				{isDragActive ? (
					<div className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dotted border-slate-400 bg-slate-200 py-2 text-center ">
						Mettre ici
						{preview.length === 0 && <Image />}
					</div>
				) : (
					<div className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dotted border-slate-400 bg-slate-200 py-2 text-center ">
						Glisser et deposer vos images ou cliquez ici
						{preview.length === 0 && <Image />}
					</div>
				)}
			</div>
			{preview && (
				<div className="mt-3 flex flex-row flex-wrap gap-3">
					{preview.map((url, i) => {
						return (
							<div className="h-[160px] w-[150px] overflow-hidden" key={i}>
								<div
									className={`relative rounded-sm bg-cover bg-center bg-no-repeat`}
									style={{
										backgroundImage: `url(${url})`,
										width: '100%',
										height: '100%',
									}}
									role="img"
									aria-label={'image preview'}
								>
									<X
										className="absolute right-1 top-1 cursor-pointer rounded-full bg-white/20 p-[1px] text-red-700"
										onClick={() => setPreview((prev) => prev.filter((_, index) => index !== i))}
										size={20}
									/>
									<span className="absolute bottom-1 right-1 bg-black/50 px-1 text-xs font-bold text-white">
										{i + 1}/{5}
									</span>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
