/* eslint-disable @typescript-eslint/no-explicit-any */
import PopUpComponent from './PopUpComponent';
import CloseModal from './CloseModal';

export default function ModalConfirmation({
	showPopUp,
	closePopUp,
	message,
	confirm,
}: {
	showPopUp: boolean;
	closePopUp: () => void;
	message: string;
	confirm: (e: any) => void;
}) {
	return (
		<PopUpComponent
			styleContainer="relative flex items-center justify-center h-full w-full"
			isOpen={showPopUp}
		>
			<div className={`absolute w-[500px] rounded-md bg-white p-4 `}>
				<CloseModal closePopUp={closePopUp} />
				<form className="mt-4 flex flex-col justify-end">
					<span className="text-center">{message}</span>
					<button
						type="submit"
						className="mt-5 w-1/3 self-center rounded-md border border-slate-600 px-2 hover:shadow-md"
						onClick={confirm}
					>
						confirm
					</button>
				</form>
			</div>
		</PopUpComponent>
	);
}
