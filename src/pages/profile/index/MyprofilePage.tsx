/* eslint-disable @typescript-eslint/no-explicit-any */
import HeaderProfile from '@/components/profile/HeaderProfile';
import PopUpComponent from '@/components/ui/PopUpComponent';
import SelectComponent from '@/components/ui/SelectComponent';
import SwitchInputComponent from '@/components/ui/SwitchInputComponent';
import { useResetScrollBar } from '@/hooks/useresetScroll';
import { getUrlImage, ToastError } from '@/lib/utils';
import { useAuth } from '@/services/state/User/auth';
import { cities } from '@/utils/mock/city';
import { Link, Outlet, useRouter } from '@tanstack/react-router';
import { PenLine, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
const RegisterSchema = z.object({
	phone: z
		.string()
		.min(10, { message: 'numéro de téléphone trop court' })
		.max(10, { message: 'numéro de téléphone trop long' }),
	name: z.string().min(4, { message: 'nom trop court' }).max(30, { message: 'nom trop long' }),
	avatar_url: z.string().url(),
	use_whatsapp: z.number(),
});
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export default function MyprofilePage() {
	useResetScrollBar();
	const { isAuth, InfoUser, editMe, logout } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [city, setCity] = useState<string>(cities[0]);
	const [checked, setChecked] = useState(InfoUser?.use_whatsapp || 0);
	const [phone, setPhone] = useState(InfoUser?.phone);
	const [files, setFiles] = useState<{ file: File; buffer: string }[]>([]);

	const [name, setName] = useState(InfoUser?.name);
	const router = useRouter();
	// const [avatar, setAvatar] = useState(null);
	useEffect(() => {
		if (!isAuth) {
			router.history.push('/');
		}
	}, [isAuth, router.history]);

	const openDialog = () => {
		setIsOpen(true);
		setFiles([]);
		document.body.style.overflow = 'hidden';
	};
	const closeDialog = () => {
		setIsOpen(false);
		setFiles([]);
		document.body.style.overflow = 'auto';
	};
	const onSubmit = (e: any) => {
		e.preventDefault();
		const phones = phone.replace(/\s+/g, '');
		if (phones.length !== 14) {
			ToastError('le numro de téléphone doit contenir 10 chiffres');
			return;
		}

		if (phones.slice(0, 4) !== '+225') {
			ToastError('Le numéro doit commencer par +225.');
			return;
		}
		if (phones.slice(4).length !== 10) {
			ToastError('Le numéro doit comporter 9 chiffres après le préfixe +225.');
			return;
		}
		if (name.length > 25) {
			ToastError('Nom trop long. Max 25 caractères.');
			return;
		}
		editMe({
			dataUser: {
				name,
				location: city,
				use_whatsapp: checked,
				phone: phones,
			},
			files: files,
		});

		closeDialog();
	};

	const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
		maxFiles: 1,
		autoFocus: true,
		accept: {
			'image/jpg': ['.jpg', '.png', '.webp', '.jpeg'],
		},
	});

	acceptedFiles.forEach((file) => {
		const files = new FileReader();
		files.onloadend = function () {
			if (!file.type.includes('image')) return ToastError("Le format de l'image n'est pas autorisé");
			if (file.size > 12 * 1024 * 1024) return ToastError("La taille de l'image est trop grande");
			if (files.result === null)
				return ToastError("Une erreur est survenue lors de l'envoi du fichier");
			setFiles([{ buffer: files.result?.toString(), file: file }]);
		};
		files.readAsDataURL(file);
	});

	return (
		<>
			<HeaderProfile
				avatar_url={getUrlImage(InfoUser?.avatar_url)}
				name={InfoUser?.name}
				created_at={InfoUser?.created_at}
				idUser={InfoUser?.id}
				openDialog={openDialog}
				logout={logout}
				location={InfoUser?.location}
				phone={InfoUser?.phone}
				email={InfoUser?.email}
			/>
			<div className="my-2 inline-flex gap-x-5 self-start rounded-lg border bg-slate-100 p-1">
				{(
					[
						['/myprofile/annonces', 'Mes annonces', false, InfoUser?.id],
						['/myprofile/favourite', 'Favoris'],
						['/myprofile/historique', 'Mon historique'],
					] as const
				).map(([to, label, , provider_id]) => {
					return (
						<Link
							key={to}
							to={to}
							activeOptions={{ includeSearch: false, exact: true }}
							activeProps={{
								className: 'text-black bg-white border shadow-md rounded-lg',
							}}
							className={'whitespace-nowrap px-1 py-2 text-xs'}
							//target='haut'
							search={(old: { page?: number; provider_id?: number }) => {
								const newParams = provider_id
									? {
											provider_id: old?.provider_id ?? provider_id,
											filter: { status: 5 as const, order_by: 'date_desc' as const },
										}
									: { page: old?.page ?? 1 };
								return newParams;
							}}
						>
							{label}
						</Link>
					);
				})}
			</div>
			<hr />
			<Outlet />
			<PopUpComponent
				styleContainer={twMerge('flex items-center select-none size-full justify-center')}
				isOpen={isOpen}
				setHide={closeDialog}
			>
				<form className="relative w-1/3 min-w-[400px] max-w-[400px] rounded-lg bg-white p-4">
					<X
						className="absolute right-0 top-0 mr-2 mt-2 rounded-full bg-red-700 text-white"
						onClick={closeDialog}
					/>
					<div className="flex w-full flex-col items-start justify-start gap-y-4 ">
						<button className="group relative " {...getRootProps()}>
							<img
								src={files[0]?.buffer ? files[0]?.buffer : getUrlImage(InfoUser?.avatar_url)}
								alt="avatar"
								className="size-20 rounded-full"
							/>
							<div className="absolute inset-0 flex items-center justify-center rounded-full group-hover:bg-black/30" />
							<PenLine size={19} className="absolute -right-3 bottom-1 rounded-full text-black" />
							<input {...getInputProps()} />
						</button>

						<input
							type={'text'}
							name={'name'}
							className={twMerge(
								`my-2 flex rounded-md border w-full border-slate-300 bg-white px-3 py-[5px] shadow-sm placeholder:text-slate-400 hover:border-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm`
							)}
							placeholder={'Nom et Prenoms'}
							value={name}
							onChange={(e) => setName(e.target.value)}
							autoComplete={'off'}
						/>
						<div className="flex w-full flex-col items-center justify-center gap-x-2">
							<PhoneInput
								onlyCountries={['ci']}
								country={'ci'}
								masks={{ ci: '.. .. .. .. ..' }}
								value={phone}
								placeholder="00 06 00 00 78"
								onBlur={(e) => setPhone(e.target.value)}
								inputStyle={{
									borderColor: 'rgb(101 163 13)	',
									fontSize: '.9rem',
									fontWeight: '400',
									height: '2rem',
									fontFamily: 'Poppins',
									backgroundColor: 'rgb(255 255 255)',
									width: '100%',
								}}
								buttonStyle={{
									fontSize: '.8rem',
									backgroundColor: 'rgb(255 255 255)',
									fontFamily: 'Poppins',
									borderEndEndRadius: '0.8rem',
								}}
								containerStyle={{
									fontFamily: 'Poppins',
									borderRadius: '0.8rem',
									width: '100%',
								}}
							/>
							<SwitchInputComponent
								label="Cochez pour liez votre numero a Whatsapp"
								name="use_whatsapp"
								defaultValue={InfoUser?.use_whatsapp || 0}
								value={checked}
								setValue={setChecked}
							/>
						</div>
						<SelectComponent
							defaultValue={InfoUser?.location}
							values={cities}
							setValues={setCity}
							label="changez l'adresse de vente"
							style="w-[100%]"
						/>

						<button onClick={onSubmit} className="mt-5 w-1/3 rounded-2xl bg-primary p-2 text-white">
							Enregistrez
						</button>
					</div>
				</form>
			</PopUpComponent>
		</>
	);
}
