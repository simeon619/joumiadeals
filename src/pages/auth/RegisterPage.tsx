/* eslint-disable react-hooks/exhaustive-deps */
import { InputOTPTel } from '@/components/auth/InputOTPTel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SelectComponent from '@/components/ui/SelectComponent';
import { myprofileRoot } from '@/lib/route';
import { getUrlImage, redirectToConnect, truncateFirstName } from '@/lib/utils';
import { inputOTPtel } from '@/services/state/App/inputOtp';
import { useAuth } from '@/services/state/User/auth';
import { cities } from '@/utils/mock/city';
import { useLayoutEffect, useNavigate, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
// const RegisterSchema = z.object({
// 	phone: z
// 		.string()
// 		.min(10, { message: 'numéro de téléphone trop court' })
// 		.max(10, { message: 'numéro de téléphone trop long' }),
// });
// type RegisterSchemaType = z.infer<typeof RegisterSchema>;

const telLength = 10;
export default function RegisterPage() {
	// const {
	// 	register,
	// 	handleSubmit,
	// 	formState: { errors },
	// } = useForm<RegisterSchemaType>({
	// 	resolver: zodResolver(RegisterSchema),
	// });
	const router = useRouter();
	const [city, setCity] = useState<string>(cities[0]);
	const { setError, value: tel } = inputOTPtel();
	const navigate = useNavigate();
	const searchParams = router.latestLocation.search as {
		name: string;
		email: string;
		avatar_url?: string | null;
		oauth_provider_name: string;
		oauth_client_id: string;
	};
	const { register: registerUser, isAuth, InfoUser } = useAuth();
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
		if (isAuth && InfoUser.id) {
			navigate({
				to: myprofileRoot.to,
				search: { provider_id: InfoUser.id, filter: { status: 5 } },
			});
		}
	}, [isAuth, InfoUser]);
	const onSubmit = () => {
		if (tel.toString().length !== telLength) {
			setError(`numéro de téléphone doit avoir ${telLength} caractères.`);
			return;
		} else {
			setError('');
		}
		const dataToSend = {
			location: city,
			name,
			avatar_url,
			email,
			oauth_client_id,
			oauth_provider_name,
			phone: tel.toString(),
		};
		registerUser(dataToSend);
		// close();
	};

	return (
		<div className="flex h-screen justify-center bg-gray-50">
			<div className=" mt-12 flex h-1/3 max-h-[500px] min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white px-8 shadow-md">
				<div className="mt-5 flex w-full flex-col gap-y-4">
					<div className="flex flex-col gap-y-4">
						<span className="min-w-[320px] max-w-[400px] font-poppins text-sm">
							Ajoutez ces dernier detail sur vous
						</span>
						<div>
							<h1 className=" font-poppins text-xl">Bonjour {truncateFirstName(name)}</h1>
							<Avatar className="bg-primary text-primary">
								<AvatarImage src={getUrlImage(avatar_url)} />
								<AvatarFallback>{name?.[0] + name?.[1]}</AvatarFallback>
							</Avatar>
						</div>
					</div>
				</div>
				<div className="mt-5 w-full">
					<div className="mb-6 flex flex-col gap-y-1">
						<InputOTPTel groupSize={4} length={telLength} label="Numéro de téléphone" />
					</div>
					<SelectComponent values={cities} setValues={setCity} label="Choisir adresse de vente" />
					<button
						type="submit"
						onClick={onSubmit}
						className="mt-5 w-full rounded-2xl bg-primary p-2 text-white"
					>
						Enregistrez
					</button>
				</div>
			</div>
		</div>
	);
}
