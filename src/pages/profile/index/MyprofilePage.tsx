import InputComponent from '@/components/ui/InputComponent';
import { useAuth } from '@/services/state/User/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, Outlet, useRouter } from '@tanstack/react-router';
import { LogOut, Mail, MapPinned, Pen, PhoneCall, Sliders, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { cities } from '@/utils/mock/city';
import SelectComponent from '@/components/ui/SelectComponent';
import AvatarComponent from '@/components/ui/AvatarComponent';
import { twMerge } from 'tailwind-merge';
import PopUpComponent from '@/components/ui/PopUpComponent';
import SwitchInputComponent from '@/components/ui/SwitchInputComponent';
import { useResetScrollBar } from '@/hooks/useresetScroll';
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
	useResetScrollBar()
	const { isAuth, InfoUser, editMe, logout } = useAuth();
	const [city, setCity] = useState<string>(cities[0]);
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();
	useEffect(() => {
		if (!isAuth) {
			console.log('🚀 ~ useEffect ~ isAuth:', isAuth);
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
			<div className="relative mt-4 flex flex-col items-center justify-center gap-y-5 rounded-sm border-2 border-gray-100 bg-slate-50 p-2">
				<div className="flex flex-col items-center gap-y-1">
					<AvatarComponent name={InfoUser.name} url={InfoUser.avatar_url || ''} style="size-15" />

					<div className="flex flex-row items-center justify-center gap-x-1">
						<span className="text-base">{InfoUser?.name}</span>
						<button
							onClick={openDialog}
							className="group flex flex-row items-center justify-center gap-x-1 rounded-2xl border-b-[1px] border-primary p-1 transition-colors hover:bg-slate-200"
						>
							<span className="text-center text-xs text-black group-hover:text-primary ">
								Edit Profile
							</span>
							<Pen size={12} className="text-black group-hover:text-primary" />
						</button>
					</div>
				</div>
				<div className="flex flex-row gap-x-6">
					<div className="flex flex-row items-center justify-center gap-x-1">
						<Mail size={20} className="text-slate-700" />
						<span className="text-sm">{InfoUser?.email}</span>
					</div>
					<div className="flex flex-row items-center justify-center gap-x-1">
						<MapPinned size={20} className="text-slate-700" />
						<span className="text-sm">{InfoUser?.location}</span>
					</div>
					<div className="flex flex-row items-center justify-center gap-x-1">
						<PhoneCall size={20} className="text-slate-700" />
						<span className="text-sm">{InfoUser?.phone} </span>
					</div>
				</div>
				<button
					aria-label="deconnexion"
					onClick={logout}
					className="absolute right-2 top-2 flex flex-row items-center gap-x-1"
				>
					<span className="text-sm text-red-600">Deconnexion</span>
					<LogOut className="cursor-pointer text-red-600" />
				</button>
				<button
					aria-label="parametre"
					onClick={() => {}}
					className="absolute left-2 top-2 flex flex-row items-center gap-x-1"
				>
					<Sliders className="cursor-pointer text-gray-900" />
					<span className="text-sm text-gray-900">Parametre</span>
				</button>
			</div>
			<div className="flex flex-wrap divide-x  py-2 text-[.85rem]">
				{(
					[
						['/myprofile', 'Mes annonces', true, InfoUser?.id],
						['/myprofile/historique', 'Mon historique'],
						['/myprofile/favourite', 'Favoris'],
						['/myprofile/report', 'Signalement'],
					] as const
				).map(([to, label, exact, provider_id]) => {
					return (
						<Link
							key={to}
							to={to}
							activeOptions={{ includeSearch: exact }}
							activeProps={{ className: `text-primary rounded-2xl p-1` }}
							className="p-2"
							search={provider_id ? { provider_id: provider_id } : {page :1}}
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
							// @ts-expect-error ts-migrate(2322) FIXME: Type 'string | undefined' is not assignable to typ...
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
