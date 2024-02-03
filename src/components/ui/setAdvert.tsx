import { PlusCircle } from 'lucide-react';

export default function SetAdvert() {
	return (
		<span className="flex h-11 max-w-[200px] cursor-pointer flex-row items-center gap-1 rounded-xl bg-blue  px-2">
			<PlusCircle color="white" size={15} />
			<span className="whitespace-nowrap font-poppins text-[14px] font-bold text-white">
				Publier une annonce
			</span>
		</span>
	);
}
