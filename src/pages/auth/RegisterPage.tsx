/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cities } from '@/utils/mock/city';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/services/state/User/auth';
import { redirectToConnect, truncateFirstName } from '@/lib/utils';
import { useLayoutEffect, useRouter } from '@tanstack/react-router';
import InputComponent from '@/components/ui/InputComponent';
import { useState } from 'react';
import SelectComponent from '@/components/ui/SelectComponent';
const RegisterSchema = z.object({
	phone: z
		.string()
		.min(10, { message: 'numéro de téléphone trop court' })
		.max(10, { message: 'numéro de téléphone trop long' }),
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
	const [city, setCity] = useState<string>(cities[0]);
	const searchParams = router.latestLocation.search as {
		name: string;
		email: string;
		avatar_url?: string | null;
		oauth_provider_name: string;
		oauth_client_id: string;
	};
	const { register: registerUser, isAuth } = useAuth();
	const name = searchParams.name;
	const email = searchParams.email!;
	const avatar_url = searchParams.avatar_url as string;
	const oauth_provider_name = searchParams.oauth_provider_name!;
	const oauth_client_id = searchParams.oauth_client_id!;

	useLayoutEffect(() => {
		if (!isAuth && !email && !oauth_provider_name && !oauth_client_id) {
			redirectToConnect();
		}
	}, []);

	useLayoutEffect(() => {
		if (isAuth) {
			router.history.push('/myprofile');
		}
	}, [isAuth]);
	const onSubmit: SubmitHandler<RegisterSchemaType> = (data) => {
		const dataToSend = {
			location: city,
			name,
			avatar_url,
			email,
			oauth_client_id,
			oauth_provider_name,
			...data,
		};
		registerUser(dataToSend);
	};

	return (
		<div className="flex h-screen justify-center bg-gray-50">
			<div className=" mt-12 flex h-1/3 max-h-[500px] min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white px-8 shadow-md">
				<div className="mt-5 flex w-full flex-col gap-y-4">
					<div className="flex flex-row gap-x-4">
						<h1 className="font-poppins text-3xl">Bonjour {truncateFirstName(name)}</h1>
						<Avatar className="bg-blue text-blue">
							<AvatarImage src={avatar_url} alt={name} />
							<AvatarFallback>{name?.[0] + name?.[1]}</AvatarFallback>
						</Avatar>
					</div>
					<span className="min-w-[320px] max-w-[400px] font-poppins text-sm">
						Ajoutez ces dernier detail sur vous
					</span>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="mt-5 w-full">
					<InputComponent
						name="phone"
						errors={errors}
						register={register}
						label="Numéro de téléphone"
						type="number"
						placeholder="00 06 00 00 78"
					/>
					<SelectComponent 	values={cities} setValues={setCity} label='Choisir adresse de vente'	/>
					<button type="submit" className="mt-5 w-full rounded-2xl bg-blue p-2 text-white">Enregistrez</button>
				</form>
			</div>
		</div>
	);
}

