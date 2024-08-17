import HeaderProfile from '@/components/profile/HeaderProfile';
import InputComponent from '@/components/ui/InputComponent';
import PopUpComponent from '@/components/ui/PopUpComponent';
import SelectComponent from '@/components/ui/SelectComponent';
import SwitchInputComponent from '@/components/ui/SwitchInputComponent';
import { useResetScrollBar } from '@/hooks/useresetScroll';
import { useAuth } from '@/services/state/User/auth';
import { cities } from '@/utils/mock/city';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Outlet, useRouter } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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
	const [city, setCity] = useState<string>(cities[0]);
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	useEffect(() => {
		if (!isAuth) {
			router.history.push('/');
		}
	}, [isAuth, router.history]);
	const onSubmit: SubmitHandler<RegisterSchemaType> = (data) => {
		const dataModified = {
			...data,
			location: city,
		};
		editMe(dataModified);
		setIsOpen(false);
		// console.log(dataModified);
	};

	const openDialog = () => {
		setIsOpen(true);
		document.body.style.overflow = 'hidden';
	};
	const closeDialog = () => {
		setIsOpen(false);
		document.body.style.overflow = 'auto';
	};
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterSchemaType>({
		resolver: zodResolver(RegisterSchema),
	});

	return (
		<>
			<HeaderProfile
				avatar_url={InfoUser?.avatar_url}
				name={InfoUser?.name}
				created_at={InfoUser?.created_at}
				idUser={InfoUser?.id}
				openDialog={openDialog}
				logout={logout}
				location={city}
				phone={InfoUser?.phone}
				email={InfoUser?.email}
			/>

			<div className="my-2 inline-flex gap-x-5 self-start rounded-lg border bg-slate-100 p-1">
				{(
					[
						['/myprofile', 'Mes annonces', false, InfoUser?.id],
						//['/myprofile/discussion', 'Discussions'],
						['/myprofile/favourite', 'Favoris'],
						['/myprofile/historique', 'Mon historique'],
					] as const
				).map(([to, label, exact, provider_id]) => {
					return (
						<Link
							key={to}
							to={to}
							// activeOptions={{ includeSearch: exact }}
							activeProps={{
								className: 'text-black bg-white border shadow-md rounded-lg',
							}}
							className={'px-1 py-2 text-sm'}
							//target='haut'
							search={(old : { page?: number, provider_id?: string }) => {
								const newParams = provider_id
									? { 
										provider_id: old?.provider_id ?? provider_id, 
										filter: { status: 5 as const } 
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
				styleContainer={twMerge(
					'w-1/3 min-w-[400px] max-w-[400px] bg-white p-4 relative mt-24 h-2/3 max-h-[600px] min-h-[600px] '
				)}
				isOpen={isOpen}
			>
				<X
					className="absolute right-0 top-0 mr-2 mt-2 rounded-full bg-red-700 text-white"
					onClick={closeDialog}
				/>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center  justify-center">
					<h1 className="mb-3 text-xl font-bold">Modification du Profile</h1>
					<div className="flex w-full flex-col items-center gap-y-4">
						<InputComponent
							register={register}
							defaultValue={InfoUser?.phone}
							errors={errors}
							label="Numéro de téléphone"
							name="phone"
							type="number"
							placeholder="00 06 00 00 78"
						/>
						<SwitchInputComponent
							errors={errors}
							label="Cochez pour liez votre numero a Whatsapp"
							name="use_whatsapp"
							register={register}
							defaultValue={InfoUser?.use_whatsapp || 0}
						/>
						<InputComponent
							register={register}
							defaultValue={InfoUser?.name}
							errors={errors}
							label="Nom et Prenoms"
							name="name"
							placeholder="Damien Celeste"
							type="text"
						/>
						<InputComponent
							register={register}
							defaultValue={InfoUser?.avatar_url || undefined}
							errors={errors}
							label="Photo"
							name="avatar_url"
							type="text"
							placeholder="https://maphoto.jpeg"
						/>
						<SelectComponent
							defaultValue={InfoUser?.location}
							values={cities}
							setValues={setCity}
							label="changez l'adresse de vente"
						/>

						<button type="submit" className="mt-5  w-1/3 rounded-2xl bg-primary p-2 text-white">
							Enregistrez
						</button>
					</div>
				</form>
			</PopUpComponent>
		</>
	);
}