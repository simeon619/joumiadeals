import Name from '../ui/Name';
import { ArrowLeft } from 'lucide-react';
export default function HeaderAuth() {
	return (
		<div className="sticky flex items-center justify-center gap-x-4 py-1 shadow-md">
			<ArrowLeft
				size={35}
				strokeWidth={2.5}
				absoluteStrokeWidth
				className="absolute left-10 top-2 text-primary"
			/>
			<Name />
			<span className="font-poppins text-base text-primary">Creation du compte</span>
		</div>
	);
}
