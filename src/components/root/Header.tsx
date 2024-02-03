import {
	Bell,
	Heart,
	MessageSquareText,
	Search,
	User,
} from 'lucide-react';
import Name from '../ui/Name';
import SetAdvert from '../ui/setAdvert';
import CategoriseMenu from '../ui/CategoriseMenu';
const SIZE_ICON = 20;
const wrapIcon = 'flex flex-col justify-center items-center';
const contentIcon = 'whitespace-nowrap text-xs';

export default function Header() {
	return (
		<div>
			<div className="flex items-center gap-x-6 p-2">
				<Name />
				<SetAdvert />
				<div className="flex items-center rounded-xl bg-slate-100 p-2">
					<input
						type="search"
						placeholder="Rechercher sur Joumiadeals"
						className="border-0 bg-slate-100 placeholder:text-slate-400 focus:outline-none"
						autoComplete="off"
						autoCapitalize="off"
						inputMode="search"
					/>
					<Search
						size={30}
						strokeWidth={2}
						absoluteStrokeWidth
						className="rounded-xl bg-blue p-1 text-white"
					/>
				</div>

				<div className="flex gap-x-6">
					<span className={wrapIcon}>
						<Bell
							size={SIZE_ICON}
							strokeWidth={2}
							absoluteStrokeWidth
						/>
						<span className={contentIcon}>Mon historique</span>
					</span>
					<span className={wrapIcon}>
						<Heart
							size={SIZE_ICON}
							strokeWidth={2}
							absoluteStrokeWidth
						/>
						<span className={contentIcon}>Favoris</span>
					</span>

					<span className={wrapIcon}>
						<MessageSquareText
							size={SIZE_ICON}
							strokeWidth={2}
							absoluteStrokeWidth
						/>
						<span className={contentIcon}>Messages</span>
					</span>

					<span className={wrapIcon}>
						<User
							size={SIZE_ICON}
							strokeWidth={2}
							absoluteStrokeWidth
						/>
						<span className={contentIcon}>Se connecter</span>
					</span>
				</div>
			</div>
			<CategoriseMenu />
		</div>
	);
}
