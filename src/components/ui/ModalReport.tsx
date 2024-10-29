import PopUpComponent from './PopUpComponent';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import TextAreaComponent from './TextAreaComponent';
import CloseModal from './CloseModal';
import { useReportProductMutation } from '@/utils/queryOptions';
const reportSchema = z.object({
	message: z
		.string()
		.min(5, { message: 'message trop court' })
		.max(1300, { message: 'message trop long' })
		.trim()
		.regex(/^\S.*$/i, { message: 'message invalide' }),
});
type reportSchemaType = z.infer<typeof reportSchema>;
export default function ModalReport({
	showPopUp,
	closePopUp,
	productId,
}: {
	showPopUp: boolean;
	closePopUp: () => void;
	productId: string | undefined;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<reportSchemaType>({
		resolver: zodResolver(reportSchema),
	});
	const reportMutation = useReportProductMutation();
	const onSubmit: SubmitHandler<reportSchemaType> = (e) => {
		if (!productId) return;
		reportMutation.mutate({ message: e.message, product_id: productId });
		closePopUp();
	};
	return (
		<PopUpComponent
			styleContainer="relative flex items-center justify-center h-full w-full"
			isOpen={showPopUp}
			setHide={closePopUp}
		>
			<div className={`absolute w-[500px] rounded-md bg-white p-4 `}>
				<CloseModal closePopUp={closePopUp} />
				<form className="mt-4 flex flex-col justify-end">
					<TextAreaComponent
						label="Decrivez votre preocupation"
						errors={errors}
						register={register}
						name="message"
						placeholder="ecrivez votre message"
					/>
					<button
						type="submit"
						className="mt-5 w-1/3 self-center rounded-md border border-slate-600 px-2 hover:shadow-md"
						onClick={handleSubmit(onSubmit)}
					>
						envoyer
					</button>
				</form>
			</div>
		</PopUpComponent>
	);
}
