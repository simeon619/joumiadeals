/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { inputOTPtel } from '@/services/state/App/inputOtp';
// import { toast } from "@/components/ui/use-toast"

export function InputOTPTel({
	length = 6,
	groupSize = 3,
	label = 'One-Time Password',
}: {
	length?: number;
	groupSize?: number;
	label?: string;
}) {
 const {setValue , error} = inputOTPtel();

	const handleChange = (value: any) => {
		setValue(value);
	};

	const groups = Math.ceil(length / groupSize);
	const slots = Array.from({ length }, (_, i) => <InputOTPSlot key={i} index={i} />);
	const slotGroups = [];
	for (let i = 0; i < groups; i++) {
		const groupSlots = slots.slice(i * groupSize, (i + 1) * groupSize);
		slotGroups.push(<InputOTPGroup key={i}>{groupSlots}</InputOTPGroup>);
	}

	return (
		<div>
			<label htmlFor="otp" className="block text-sm font-medium text-gray-700">
				{label}
			</label>
			<div className="mt-1">
				<InputOTP
					maxLength={length}
					onChange={(e) => {
						handleChange(e);
					}}
				>
					{slotGroups}
				</InputOTP>
			</div>
			{error && <p className="mt-1 text-xs text-red-600">{error}</p>}
		</div>
	);
}
