/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
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
			"https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
	field: HTMLInputTypeAttribute;
	require?: boolean;
	default?: string;
	icon: string;
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
		type: 'string',
		name: 'couleur',
		field: 'select',
		icon:
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBhbGV0dGUiPjxjaXJjbGUgY3g9IjEzLjUiIGN5PSI2LjUiIHI9Ii41IiBmaWxsPSJjdXJyZW50Q29sb3IiLz48Y2lyY2xlIGN4PSIxNy41IiBjeT0iMTAuNSIgcj0iLjUiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxjaXJjbGUgY3g9IjguNSIgY3k9IjcuNSIgcj0iLjUiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjxjaXJjbGUgY3g9IjYuNSIgY3k9IjEyLjUiIHI9Ii41IiBmaWxsPSJjdXJyZW50Q29sb3IiLz48cGF0aCBkPSJNMTIgMkM2LjUgMiAyIDYuNSAyIDEyczQuNSAxMCAxMCAxMGMuOTI2IDAgMS42NDgtLjc0NiAxLjY0OC0xLjY4OCAwLS40MzctLjE4LS44MzUtLjQzNy0xLjEyNS0uMjktLjI4OS0uNDM4LS42NTItLjQzOC0xLjEyNWExLjY0IDEuNjQgMCAwIDEgMS42NjgtMS42NjhoMS45OTZjMy4wNTEgMCA1LjU1NS0yLjUwMyA1LjU1NS01LjU1NEMyMS45NjUgNi4wMTIgMTcuNDYxIDIgMTIgMnoiLz48L3N2Zz4=',
		require: true,
	},
	{
		type: 'number',
		name: 'kilometrage',
		field: 'number',
		icon:
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdhdWdlIj48cGF0aCBkPSJtMTIgMTQgNC00Ii8+PHBhdGggZD0iTTMuMzQgMTlhMTAgMTAgMCAxIDEgMTcuMzIgMCIvPjwvc3ZnPg==',
		require: true,
	},
	{
		type: 'files',
		name: 'photo du vehicule',
		field: 'file',
		icon:
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdhdWdlIj48cGF0aCBkPSJtMTIgMTQgNC00Ii8+PHBhdGggZD0iTTMuMzQgMTlhMTAgMTAgMCAxIDEgMTcuMzIgMCIvPjwvc3ZnPg==',
		require: true,
		maxSize: 50000,
		mime: ['image/png', 'image/jpeg', 'image/jpg'],
	},
	{
		type: 'string',
		field: 'text',
		icon:
			'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWtleS1zcXVhcmUiPjxwYXRoIGQ9Ik0xMi40IDIuN2MuOS0uOSAyLjUtLjkgMy40IDBsNS41IDUuNWMuOS45LjkgMi41IDAgMy40bC0zLjcgMy43Yy0uOS45LTIuNS45LTMuNCAwTDguNyA5LjhjLS45LS45LS45LTIuNSAwLTMuNFoiLz48cGF0aCBkPSJtMTQgNyAzIDMiLz48cGF0aCBkPSJNOS40IDEwLjYgMiAxOHYzYzAgLjYuNCAxIDEgMWg0di0zaDN2LTNoMmwxLjQtMS40Ii8+PC9zdmc+',
		require: true,
		name: 'modele',
		enum: [
			'130',
			'&160',
			'&170',
			'170 APRÈS GUERRE',
			'&180',
			'&190',
			'&200',
			'&220',
			'220 1951/54',
			'220 1954/1959',
			'220 1959/65',
			'&230',
			'&240',
			'&250',
			'250 1965/69',
			'&260',
			'260 D',
			'&280',
			'280 1967/80',
			'&290',
			'&300',
			'300 1951/54',
			'300 1961/72',
			'300 K',
			'300 SL',
			'&320',
			'320 Mannheim',
			'&350',
			'350 Mannheim',
			'370 Mannheim',
			'&380',
			'460 Nürburg',
			'&500',
			'500 K',
			'500 Nürburg',
			'540 K',
			'&560',
			'600 K',
			'&620',
			'&630',
			'680 S',
			'710 SS',
			'720 SSK',
			'&770',
			'AMG GT',
			'AMG GT 4 Portes',
			'AMG GT Roadster',
			'C',
			'CLA',
			'CLA Shooting Brake',
			'CLE Coupé',
			'CLS Shooting Brake',
			'Citan Combi',
			'Citan Tourer',
			'Classe A',
			'Classe A Berline',
			'Classe A Coupe',
			'Classe A Family',
			'Classe B',
			'Classe C',
			'Classe C All-Terrain',
			'Classe C Break',
			'Classe C Cabriolet',
			'Classe C Coupe Sport',
			'Classe C Coupé',
			'Classe CLC',
			'Classe CLK',
			'Classe CLK Cabriolet',
			'Classe CLS',
			'Classe E',
			'Classe E All-Terrain',
			'Classe E Break',
			'Classe E Cabriolet',
			'Classe E Coupe',
			'Classe G',
			'Classe GL',
			'Classe GLK',
			'Classe ML',
			'Classe R',
			'Classe S',
			'Classe S Cabriolet',
			'Classe S Coupe/CL',
			'Classe S Type 116',
			'Classe SL',
			'Classe SLK',
			'Classe T',
			'Classe V',
			'Coupe CL',
			'E',
			'EQA',
			'EQB',
			'EQC',
			'EQE',
			'EQE SUV',
			'EQS',
			'EQS SUV',
			'EQT',
			'EQV',
			'GLA',
			'GLB',
			'GLC',
			'GLC Coupé',
			'GLE',
			'GLE Coupé',
			'GLS',
			'MB 100',
			'Marco Polo',
			'PAGODE',
			'S',
			'SL Type 107',
			'SLC',
			'SLC Type 107',
			'SLR',
			'SLR Roadster',
			'SLS',
			'SLS Roadster',
			'Sprinter',
			'Sprinter Tourer',
			'Stuttgart 200',
			'Stuttgart 260',
			'Type 114',
			'Type 114 Coupé',
			'Type 115',
			'Vaneo',
			'Viano',
			'Vito Combi',
			'Vito Tourer',
			'Autre',
		],
	},
];

// console.log('🚀 ~ caraceristiques:', caraceristiques);
