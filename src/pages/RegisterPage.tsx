/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cities } from '@/utils/city';
import Select from 'react-select';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/services/state/User/auth';
import { redirectToConnect, truncateFirstName } from '@/lib/utils';
import { useLayoutEffect, useRouter } from '@tanstack/react-router';
const RegisterSchema = z.object({
	phone: z.string().min(10).max(10),
});

type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export default function RegisterPage() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterSchemaType>({
		resolver: zodResolver(RegisterSchema),
	});
	const router = useRouter();
	const [city, setCity] = useState(cities[0].value);
	const searchParams = router.latestLocation.search as {
		name: string;
		email: string;
		avatarUrl?: string | null;
		oauth_provider_name: string;
		oauth_client_id: string;
	};
	const { login, isAuth } = useAuth();
	const name = searchParams.name;
	const email = searchParams.email!;
	const avatarUrl = searchParams.avatarUrl as string;
	const oauth_provider_name = searchParams.oauth_provider_name!;
	const oauth_client_id = searchParams.oauth_client_id!;

	useLayoutEffect(() => {
		console.log({ name, email, avatarUrl, oauth_provider_name, oauth_client_id });
		if (!name && !email && !avatarUrl && !oauth_provider_name && !oauth_client_id) {
			redirectToConnect();
		}
	}, []);

	console.log('🚀 ~ useLayoutEffect ~ router.latestLocation:', router);
	useLayoutEffect(() => {
		if (isAuth) {
			// router.latestLocation;
			router.history.push("/");
			console.log(isAuth);
		}
	}, [isAuth]);
	const onSubmit: SubmitHandler<RegisterSchemaType> = (data) => {
		const dataToSend = {
			location: city,
			name,
			avatarUrl,
			email,
			oauth_client_id,
			oauth_provider_name,
			...data,
		};
		login(dataToSend);
	};

	return (
		<div className="flex h-screen justify-center bg-gray-50">
			<div className=" mt-12 flex h-1/3 max-h-[500px] min-h-[400px]  flex-col items-center justify-center rounded-2xl bg-white px-8 shadow-md">
				<div className="mt-5 flex w-full flex-col gap-y-4">
					<div className="flex flex-row gap-x-4">
						<h1 className="font-poppins text-3xl">Bonjour {truncateFirstName(name)}</h1>
						<Avatar className="bg-blue text-blue">
							<AvatarImage src={avatarUrl} alt={name} />
							<AvatarFallback>{name?.[0] + name?.[1]}</AvatarFallback>
						</Avatar>
					</div>
					<span className="min-w-[320px] max-w-[400px] font-poppins text-sm">
						Ajoutez ces dernier detail sur vous
					</span>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="mt-5 w-full">
					<div className="mt-5  w-full">
						<label className="block">
							<span className="block text-sm font-medium text-slate-700 after:ml-0.5 after:text-red-500 after:content-['*']">
								Numero de telephone
							</span>
							<input
								type="number"
								// name="telephone"
								{...register('phone')}
								className="mt-1 flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm placeholder:text-slate-400 hover:border-blue focus:border-blue focus:outline-none focus:ring-1 focus:ring-blue sm:text-sm"
								placeholder="06 00 00 00 00"
							/>
							{<p className={twMerge(errors.phone && 'text-xs text-red-500')}>{errors?.phone?.message}</p>}
						</label>
					</div>
					<div className="mt-5  w-full">
						<span className="block text-sm font-medium text-slate-700 after:ml-0.5 after:text-red-500 after:content-['*']">
							Adresse de vente
						</span>
						<Select
							name="city"
							// {...register('city')}
							theme={{
								//@ts-expect-error next-line
								colors: {
									primary: '#115570',
									primary25: '#115570',
									primary50: '#115570',
									neutral0: '#fff',
								},
							}}
							onChange={(e) => setCity(e?.value as string)}
							defaultValue={cities[0]}
							className="w-full rounded-2xl bg-white shadow-sm"
							options={cities}
						/>
						{/* {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>} */}
					</div>
					<button className="mt-5 w-full rounded-2xl bg-blue p-2 text-white">Enregistrez</button>
				</form>
			</div>
		</div>
	);
}
