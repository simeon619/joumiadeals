import InputComponent from '@/components/ui/InputComponent';
import { useAuth } from '@/services/state/User/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, Outlet, useLayoutEffect, useRouter } from '@tanstack/react-router';
import { LogOut, Mail, MapPinned, Pen, PhoneCall, Sliders, X } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { cities } from '@/utils/mock/city';
import SelectComponent from '@/components/ui/SelectComponent';
import AvatarComponent from '@/components/ui/AvatarComponent';
import { twMerge } from 'tailwind-merge';
import PopUpComponent from '@/components/ui/PopUpComponent';
const RegisterSchema = z.object({
	phone: z
		.string()
		.min(10, { message: 'numéro de téléphone trop court' })
		.max(10, { message: 'numéro de téléphone trop long' }),
	name: z.string().min(4, { message: 'nom trop court' }).max(30, { message: 'nom trop long' }),
	avatar_url: z.string().url(),
});
type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export default function MyprofilePage() {
	const { isAuth, InfoUser, editMe, logout } = useAuth();
	console.log('🚀 ~ MyprofilePage ~ InfoUser:', InfoUser);
	const [city, setCity] = useState<string>(cities[0]);
	const [isOpen, setIsOpen] = useState(false);

	const onSubmit: SubmitHandler<RegisterSchemaType> = (data) => {
		const dataModified = {
			...data,
			location: city,
		};
		editMe(dataModified);
		setIsOpen(false);
		// console.log(dataModified);
	};

	const openDialog = () =>  {
		setIsOpen(true);
		document.body.style.overflow = 'hidden';
	};
	const closeDialog = () => {
		setIsOpen(false);
		document.body.style.overflow = 'auto';
	}
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterSchemaType>({
		resolver: zodResolver(RegisterSchema),
	});

	const router = useRouter();
	useLayoutEffect(() => {
		if (!isAuth) {
			router.history.push('/');
		}
	}, [isAuth, router.history]);

	return (
		<>
			<div className="relative mt-4 flex flex-col items-center justify-center gap-y-5 rounded-sm border-2 border-gray-100 bg-slate-50 p-2">
				<div className="flex flex-col items-center gap-y-1">
					<AvatarComponent name={InfoUser.name} url={InfoUser.avatar_url || ''} style="size-15" />

					<div className="flex flex-row items-center justify-center gap-x-1">
						<span className="text-base">{InfoUser?.name}</span>
						<button
							onClick={openDialog}
							className="group flex flex-row items-center justify-center gap-x-1 rounded-2xl border-b-[1px] border-blue p-1 transition-colors hover:bg-slate-200"
						>
							<span className="text-center text-xs text-black group-hover:text-blue ">Edit Profile</span>
							<Pen size={12} className="text-black group-hover:text-blue" />
						</button>
					</div>
				</div>
				<div className="flex flex-row gap-x-6">
					<div className="flex flex-row items-center justify-center gap-x-1">
						<Mail size={20} className="text-amber-500" />
						<span className="text-sm">{InfoUser?.email}</span>
					</div>
					<div className="flex flex-row items-center justify-center gap-x-1">
						<MapPinned size={20} className="text-blue" />
						<span className="text-sm">{InfoUser?.location}</span>
					</div>
					<div className="flex flex-row items-center justify-center gap-x-1">
						<PhoneCall size={20} className="text-red-700" />
						<span className="text-sm">{InfoUser?.phone} </span>
					</div>
				</div>
				<button
					aria-label="deconnexion"
					onClick={logout}
					className="absolute right-2 top-2 flex flex-row items-center gap-x-1"
				>
					<span className="text-sm text-red-700">Deconnexion</span>
					<LogOut className="cursor-pointer text-red-700" />
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
						['/myprofile', 'Mes annones', true],
						['/myprofile/historique', 'Mon historique'],
						['/myprofile/favourite', 'Favoris'],
						['/myprofile/report', 'Signalement'],
					] as const
				).map(([to, label, exact]) => {
					return (
						<Link
							key={to}
							to={to}
							activeOptions={{ exact }}
							activeProps={{ className: `text-blue rounded-2xl p-1` }}
							className="p-2"
						>
							{label}
						</Link>
					);
				})}
			</div>
			<hr />
			<Outlet />
			<PopUpComponent styleContainer={twMerge("w-1/3 min-w-[400px] max-w-[400px] bg-white p-4 relative mt-24 h-2/3 max-h-[600px] min-h-[600px] ")} isOpen={isOpen}>
				<X
					className="absolute right-0 top-0 mr-2 mt-2 rounded-full bg-red-700 text-white"
					onClick={closeDialog}
				/>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-5 flex flex-col items-center  justify-center"
				>
					<h1>Modification du Profile</h1>
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
						<button type="submit" className="mt-5  w-1/3 rounded-2xl bg-blue p-2 text-white">
							Enregistrez
						</button>
					</div>
				</form>
			</PopUpComponent>
		</>
	);
}
