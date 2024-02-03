
interface CategoryItem {
	[key: string]: string[];
  }
  
  export interface MenuCategories {
	immobilier: CategoryItem;
	vehicules: CategoryItem;
	emploi: CategoryItem;
	mode: CategoryItem;
	'maisons & jardin': CategoryItem;
	famille: CategoryItem;
	electronique: CategoryItem;
	Loisirs: CategoryItem;
	Autres: CategoryItem;
  }
export const MenuCat : MenuCategories = {
	immobilier: {
		'tout Immobilier': [''],
		'ventes Immobilières': [
			'appartement',
			'maison',
			'terrain',
			'voir tout',
		],
		locations: ['appartement', 'maison', 'terrain', 'voir tout'],
		colocations: [''],
		'local & Magasin': [''],
	},

	vehicules: {
		'tout Vehicule': [''],
		voitures: [
			'Peugeot',
			'Renault',
			'Volkswagen',
			'Mercedes',
			'BMW',
			'Audi',
			'Voir toutes les marques',
		],
		motos: [
			'Yamaha',
			'Honda',
			'BMW',
			'Kawasaki',
			'Suzuki',
			'Voir toutes les marques',
		],
		camions: [''],
		'equipements auto': [''],
		'equipements moto': [''],
		autres: [''],
	},

	emploi: {
		'tout emploi': [''],
		"offres d'emploi": [
			'interim',
			'CDD',
			'CDI',
			'stagiaire',
			'voir tout',
		],
		"demande d'emploi": [],
	},
	mode: {
		'tout Mode': [''],
		vetement: ['bebe', 'femme', 'homme', 'enfant'],
		chaussure: ['femme', 'homme', 'enfant'],
		'montres & bijoux': ['homme', 'femme', 'mixte'],
		'accesoires et Bagageries': ['homme', 'femme', 'enfant', 'mixte'],
	},
	'maisons & jardin': {
		'tout Maison & Jardin': [''],
		ameublement: [
			'Table de salle à manger',
			'Canapé',
			'Chaise',
			'tabouret et banc',
			'Lit',
			'Meuble de cuisine',
			'Fauteuil',
			'Armoire',
			'Buffet',
			'Voir tout',
		],
		electromenager: [
			'Réfrigérateur',
			'Lave-linge',
			'Lave-vaisselle',
			'Congélateur',
			'Four',
			'Aspirateur',
			'Micro-ondes',
			'Voir tout',
		],
		'Arts de table': [
			'Assiette',
			'Verre',
			'Service de vaisselle',
			'Voir tout',
		],
		Decoration: [
			'Miroir',
			'Tableau et toile',
			'Vase, cache pot et céramique',
			'Sculpture et statue',
			'Tapis',
			'Lustre',
			'Lampe à poser',
			'Horloge, pendule et réveil',
			'Applique',
			'Rideaux, voilage et store',
			'Lampadaire',
			'Suspension',
			'Voir tout',
		],
		'linge de maison': [
			'Linge de lit',
			'Linge de bain',
			'Linge de table',
			'Déco textile',
			'Équipement du lit',
			'Autre',
		],
		jardinage: [''],
		bricolages: [''],
		'papeteries & fournitures scolaire': [''],
	},
	famille: {
		'tout famille': [''],
		'Equipement bebe': ['Poussette', 'Siege auto', 'Voir tout'],
		'Mobilier Enfant': [
			'Baignoire',
			'Chaise haute',
			'Lit bébé',
			'Voir tout',
		],
		'Jouet bebe': [''],
	},
	electronique: {
		'tout electronique': [''],
		Ordinateur: ['macBook', 'pc portable', 'pc fixe', 'pc gamer'],
		'accessoire informatique': [
			'clavier',
			'souris',
			'ecran',
			'carte graphique',
			'processeur',
			'ram',
			'souris',
			'ecran',
			'carte graphique',
			'processeur',
			'stockage',
			'disque dur',
			'autre',
		],
		tablette: [''],
		smartphone: [
			'Apple',
			'Samsung',
			'Huawei',
			'Sony',
			'One plus',
			'Google',
			'Voir tout',
		],
		'Accessoire telephone': [''],
		'Console de jeux': [],
		'Photo audio & video': [
			'Télévision',
			'Enceintes',
			'Appareil photo et objectifs',
			'Casque & Ecouteurs',
			'Vidéoprojecteur',
			'Accessoires',
			'Voir tout',
		],
		'jeux videos': [''],
	},
	Loisirs: {
		'tout loisir': [''],
		'CD & DVD': [''],
		Livres: [''],
		'Instrument de Musique': [''],
		'Jeux & Jouets': [
			'Jeux de société',
			'Poupées et accessoires',
			'Porteurs, trotteurs et draisiennes',
			'Jouets d’éveil',
			'Cuisines et dînettes',
			'Jeux de construction',
			'Voitures et circuits',
			'Puzzle',
			'Voir tout',
		],
		Velo: [
			'Vélo de course',
			'VTT',
			'Vélo électrique',
			'Vélo enfant',
			'VTC',
			'Vélo de ville',
			'Equipement',
			'Voir tout',
		],
	},
	Autres: {
		Services: [
			'Cours particulier',
			'Plombier',
			'Electricite',
			'Bricolages & Reparations',
			'Entraide entre Voisin',
			'Voir tout',
		],
		Animaux: [
			'Chien',
			'Chat',
			'Accessoire Animaux',
			'Animaux perdus',
			'Voir tout',
		],
	},
};
