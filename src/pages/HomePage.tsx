import SetAdvert from '@/components/ui/setAdvert';
import market from '../assets/svg/flea market-bro.svg';

export default function HomePage() {
	return (
		<div className="p-2">
			<div className="mt-2 flex flex-col items-center justify-center rounded-md bg-slate-200 p-2">
				<h1 className=" text-center font-poppins text-xl">
					Faites vos premiers revenue en vendant
				</h1>
				<SetAdvert />
			</div>

			<div className="flex justify-center">
				<img
					className="w-4/5"
					src={market}
					alt="marketpace entre client et fournisseur"
				/>
			</div>
			<h1 className="mt-12 text-center font-poppins text-2xl">
				Rejoignez le meilleur site de pettite annonce en cote
				d&apos;ivoire.
			</h1>
		</div>
	);
}
