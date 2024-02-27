import { faker } from '@faker-js/faker';
import { HTMLInputTypeAttribute } from 'react';

type CategoryType = "men's clothing" | "women's clothing" | 'jewelery' | 'electronics';
type BrandType = 'Samsung' | 'Apple' | 'Huawei' | 'Sony' | 'One plus' | 'Google';

interface Product {
	title: string;
	price: string;
	statut: 'bon etat' | 'tres bon etat' | 'neuf' | 'abime';
	category: CategoryType;
	urgence: boolean;
	images: string[];
	_id: string;
	avatar: string;
	fullName: string;
	brand: BrandType;
	description: string;
	couleur: 'rouge' | 'bleu' | 'vert' | 'noir';
	date: Date;
	stockage: number;
	localisation: 'Abidjan yopougon' | 'Abidajn cocody' | 'San pedro';
}
function createRandomProduct(): Product {
	return {
		title: faker.commerce.productName(),
		urgence: faker.datatype.boolean(),
		price: faker.commerce.price(),
		fullName: faker.person.fullName(),
		statut: faker.helpers.arrayElement(['bon etat', 'tres bon etat', 'neuf', 'abime']),
		category: faker.helpers.arrayElement([
			"men's clothing",
			"women's clothing",
			'jewelery',
			'electronics',
		]),
		images: [
			faker.image.urlLoremFlickr(),
			faker.image.urlLoremFlickr(),
			faker.image.urlLoremFlickr(),
			faker.image.urlLoremFlickr(),
			faker.image.urlLoremFlickr(),
			'https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
		],
		_id: faker.string.uuid(),
		avatar: faker.image.avatarGitHub(),
		brand: faker.helpers.arrayElement(['Samsung', 'Apple', 'Huawei', 'Sony', 'One plus', 'Google']),
		description: faker.commerce.productDescription(),
		couleur: faker.helpers.arrayElement(['rouge', 'bleu', 'vert', 'noir']),
		date: faker.date.past(),
		stockage: faker.number.int({ min: 60, max: 1000 }),
		localisation: faker.helpers.arrayElement(['Abidjan yopougon', 'Abidajn cocody', 'San pedro']),
	};
}
const generateRandomProducts = (count: number) => {
	const products = [];
	for (let i = 0; i < count; i++) {
		products.push(createRandomProduct());
	}
	return products;
};

export const products = generateRandomProducts(40);

type FieldOptions = {
	type: 'string' | 'number' | 'boolean' | 'date' | 'files';
	name: string;
	placeholder?: string;
	label?: string;
	field: HTMLInputTypeAttribute | 'select';
	require?: boolean;
	default?: string;
	icon?: string;
	match?: [string, string]; // regexString, i
	enum?: string[] | number[];
	min?: number;
	max?: number;
	maxSize?: number;
	mime?: (string | [string, number])[];
}[];
const batlescouille = { couleur: 'bleue', kilometrage: 500000, modele: 'ABARTH' };
const caraceristiques: FieldOptions = [
	{
		field: 'select',
		name: 'Etat',
		type: 'string',
		enum: [
			"Choisir l'etat",
			'Neuf',
			'Quasi neuf',
			'Bon état',
			'Pour reparation',
		],
		require: true,
	},
	{
		field: 'select',
		name: "Type de vêtement",
		type: 'string',
		enum: [
			"Choisir le type",
			'Robes',
			'Jupes',
			'Manteaux',
			'Vestes',
			'Hauts',
			'T-Shirts',
			'Polos',
			'Pyjamas/Dors-biens',
			'Leggings/Collants',
			'Maillots de bain',
			'Débardeurs/Sous-corps',
			'Bodies',
			'Ensembles',
			'Combinaisons',
			'Pantalons',
			'Pulls/Gilets/Mailles',
			'Jeans',
			'Chemises/Chemisiers',
			'Costumes/Tailleurs',
			'Shorts/Pantacourts/Bermudas',
			'Sports/Danse',
			'Maillots de bain/vêtements de plage',
			'Autre',
		],
		require: true,
	},
	{
		field: 'select',
		name: 'Stockage (Go)',
		type: 'string',
		enum: [
			'32 Go',
			'64 Go',
			'128 Go',
			'256 Go',
			'512 Go',
			'512 Go',
			'1 To',
			'1.5 To',
			'2 To',
			'plus de 2To',
		],
		require: true,
	},

	{
		field: 'select',
		name: 'Modèle',
		type: 'string',
		enum: [
			'Choisir le Modèle',
			'Playstation 5 (PS5)',
			'Playstation 4 (PS4)',
			'Playstation 4 Slim (PS4 Slim)',
			'Playstation 4 Pro (PS4 pro)',
			'Playstation 3 Slim (PS3 Slim)',
			'Playstation 2 (PS2)',
			'Playstation 2 Slim (PS2 Slim)',
			'Playstation 1 (PS1)',
			'Playstation Vita (PS Vita)',
			'PlayStation Classic',
			'PSP',
			'Autre',
		],
		require: true,
	},
	{
		field: 'select',
		name: 'Ram',
		type: 'string',
		enum: ['1 Go', '2 Go', '4 Go', '6 Go', '8 Go', '16 Go', '32 Go', 'plus de 64 Go'],
		require: true,
	},
	{
		field: 'select',
		name: 'Type de produit',
		type: 'string',
		enum: [
			'Choisir le type',
			'Imprimante & scanner',
			'Disque dur & lecteur',
			'Unité centrale',
			'Carte graphique',
			'Câble & adaptateur',
			'Carte mère',
			'Écran',
			'Réseau & modem',
			'Processeur',
			'Stockage',
			'Logiciel',
			'Clavier et souris',
			'Autre',
		],
	},
	{
		field: 'number',
		name: 'Ram',
		type: 'number',
		placeholder: 'Ram (GB)',
		require: true,
	},
	{
		field: 'number',
		name: 'Stockage',
		type: 'number',
		placeholder: 'Stockage (GB)',
		require: true,
	},
	{
		field: 'select',
		name: 'Television (TV)',
		type: 'string',
		enum: [
			'Choisir la marque de Television',
			'Samsung',
			"LG (Life's Good)",
			'Sony',
			'Panasonic',
			'Philips',
			'TCL (The Creative Life)',
			'Hisense',
			'Smart Tv',
			'Nasco',
			'Skyline',
			'East Point',
			'Hikers',
			'Ilux',
			'Atl',
			'Sharp',
			'Vizio',
			'Toshiba',
			'JVC (Japan Victor Company)',
			'Sanyo',
			'RCA (Radio Corporation of America)',
			'Grundig',
			'Haier',
			'Hitachi',
			'Akai',
			'Dynex',
			'Polaroid',
			'Element',
			'Insignia',
			'Westinghouse',
			'Seiki',
			'Proscan',
			'Magnavox',
			'Funai',
			'AOC (Admiral Overseas Corporation)',
			'Sansui',
			'Vestel',
			'Changhong',
			'Skyworth',
			'Konka',
			'Metz',
			'Loewe',
			'Xiaomi',
			'OnePlus',
			'Philips',
			'Metz',
			'Loewe',
			'Xiaomi',
			'Oneplus',
			'Autre',
		],
		require: true,
	},
	{
		field: 'select',
		name: 'Carte graphique (Gpu)',
		type: 'string',
		enum: ['Choisir un type de Gpu', 'Nvidia', 'AMD', 'Intel', 'Autre'],
	},
];
// {
// 	field: 'select',
// 	name: 'Permis',
// 	type: 'string',
// 	enum: ['Type de Permis', 'Sans permis', 'Avec permis'],
// 	require: true,
// },
// {
// 	field: 'number',
// 	name: 'Kilometrage',
// 	type: 'number',
// 	placeholder: 'Kilometrage (km)',
// 	require: true,
// },
// {
// 	field: 'select',
// 	name: 'Type de bateau',
// 	type: 'string',
// 	enum: ['Choisir un type de bateau', 'Barques', 'Bateau', 'Voilier', 'Jet skis/Sccoter','Autre'],
// 	require: true,
// },

// ];
/**
 * Immobilier : 6737d731-2601-4063-a363-241e6d6989e8,
 * Ventes Immobilières : 633bd537-57cb-4476-bcbd-6fc10d705a9f",
 * Location Immobilières : b423194c-a762-4087-8b50-a63b30a67f95
 */

// console.log('🚀 ~ caraceristiques:', caraceristiques);

// {
// 	field :"number",
// 	name: "Année de construction",
// 	type: "number",
// 	require: true,
// 	placeholder: "Année de construction",
// }
