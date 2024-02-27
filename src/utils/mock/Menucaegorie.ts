/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CategoryType } from '@/services/api/product_categorie';
import { BASE_URL } from '../constante';

interface CategoryItem {
	[key: string]: string[];
}

export type MenuCategories = {
	immobilier: CategoryItem;
	vehicules: CategoryItem;
	emploi: CategoryItem;
	mode: CategoryItem;
	'maisons & jardin': CategoryItem;
	famille: CategoryItem;
	electronique: CategoryItem;
	Loisirs: CategoryItem;
	Autres: CategoryItem;
};
export const MenuCat: MenuCategories = {
	immobilier: {
		'tout Immobilier': [''],
		'ventes Immobilières': ['appartement', 'maison', 'Magasin & Local', 'terrain', 'voir tout'],
		locations: ['appartement', 'maison', 'terrain', 'Magasin & Local', 'voir tout'],
		// colocations: [''],
		// 'local & Magasin': [''],
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
		motos: ['Yamaha', 'Honda', 'BMW', 'Kawasaki', 'Suzuki', 'Voir toutes les marques'],
		camions: [''],
		'equipements auto': [''],
		'equipements moto': [''],
		autres: [''],
	},

	emploi: {
		'tout emploi': [''],
		"offres d'emploi": ['interim', 'CDD', 'CDI', 'stagiaire', 'voir tout'],
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
		'Arts de table': ['Assiette', 'Verre', 'Service de vaisselle', 'Voir tout'],
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
		'Mobilier Enfant': ['Baignoire', 'Chaise haute', 'Lit bébé', 'Voir tout'],
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
			'stockage',
			'disque dur',
			'autre',
		],
		tablette: [''],
		smartphone: ['Apple', 'Samsung', 'Huawei', 'Sony', 'One plus', 'Google', 'Voir tout'],
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
		Animaux: ['Chien', 'Chat', 'Accessoire Animaux', 'Animaux perdus', 'Voir tout'],
	},
};

// let categories: any = null;
// const getFetchCat = async () => {
// 	const response = await fetch(`${BASE_URL}/get_category_all_child_list`, {
// 		method: 'POST',
// 		body: JSON.stringify({ id: null }),
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Accept: 'application/json',
// 		},
// 	});
// 	if (!response.ok) throw new Error('Failed to fetch');
// 	const data = await response.json();
// 	console.log('🚀 ~ getFetchCat ~ data:', data);
// 	return data;
// };

// export async function getMenu() {
// 	if (!categories) categories = await getFetchCat();
// 	const result = {};
// 	recursive(null, result, 0);
// 	console.log(result);
// 	return result;
// }

export function get_children(parent_id: string | null, cats: CategoryType) {
	if (!cats) return [];
	return cats.filter((category) => category.parent_category_id == parent_id);
}

export const get_parent = (id: string | null, cats: CategoryType) => {
	const cat = cats.find((category) => {
		return category.id == id;
	});
	return cat;
};

export function get_old_parent(id: string | null, cats: CategoryType) {
	const accu: CategoryType = [];
		const cat = cats.filter((category) => category.parent_category_id == id);
		if (cat) {
			cat.forEach((c) => {
				if (c.is_parentable) accu.push(c);
				else if(!c.parent_category_id){
					get_old_parent(c.id, cats)
				}
			});
		}

	return accu;
}

export function get_first_cat_icon(id: string | null, cats: CategoryType) {
	const cat = cats.find((category) => {
		return category.id == id;
	});

	if(cat?.parent_category_id){
		return get_first_cat_icon(cat.parent_category_id, cats)
	} else {
		return cat?.icon
	}
	
}


export function get_all_parents(parent_id: string | null, cats: CategoryType) {
	if (!cats) return [];
	let first = true;
	const parents: CategoryType = [];
	while (true) {
		const cat = cats.find((category) => category.id == parent_id);
		if (first && cat) {
			parents.push(cat);
			first = false;
		}
		const parent = cats.find((c) => c.id == cat?.parent_category_id);
		if (parent) {
			parents.push(parent);
			parent_id = parent.id;
		} else {
			break;
		}
	}
	if (!parents || parents.length == 0) return [];
	return parents.map((p) => p.label);
}

export const getCategorieById = (id: string, cats: CategoryType) => {
	return cats.find((category) => {
		return category.id == id;
	});
};

export function get_caracteristique_child(child_id: string | null, cats: CategoryType) {
	const parents: CategoryType = [];
	if (!cats) return [];
	let first = true;
	while (true) {
		const cat = cats.find((category) => category.id == child_id);
		if (first && cat) {
			parents.push(cat);
			first = false;
		}
		const parent = cats.find((c) => c.id == cat?.parent_category_id);
		if (parent) {
			parents.push(parent);
			child_id = parent.id;
		} else {
			break;
		}
	}
	if (!parents || parents.length == 0) return [];
	return parents.map((p) => p.caracteristique_field);
}

// const cat = await getFetchCat()
export function BuildMenu(id: string | null, obj: any, count: number, categories: CategoryType) {
	const categoryChild = categories.filter(
		(category: { parent_category_id: string | null }) => category.parent_category_id == id
	);
	categoryChild.forEach((child, index) => {
		if (count === 0) {
			const dr = (obj[child.label + ':' + child.id] = { icon: child.icon });
			BuildMenu(child.id, dr, count + 1, categories);
		} else if (count === 1) {
			const nameId = child.label + ':' + child.id;
			const arr = (obj[nameId] = []);
			BuildMenu(child.id, arr, count + 1, categories);
		} else if (count === 2 && index <= 6) {
			obj.push(child.label + ':' + child.id);
		}
	});
}
