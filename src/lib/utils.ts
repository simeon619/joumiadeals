/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryType, f_form_type, StatusType } from '@/services/api/product_categorie';
import { type ClassValue, clsx } from 'clsx';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function redirectToConnect() {
	window.location.href = 'http://localhost:3333/connexion';
}
export function truncateFirstName(name: string | undefined | null) {
	if (!name) {
		return '*_*';
	}
	const firstName = name.split(' ')[0];
	return firstName.slice(0, 8);
}

export function setToken(value: string): void {
	localStorage.setItem('token', value);
}

export function getToken(): string {
	const item = localStorage.getItem('token');
	if (!item) {
		return '';
	}
	return item;
}
export const field_annonce = [
	"Titre de l'annonce",
	"prix de l'annonce (en FCFA)",
	"Description de l'annonce",
];
export const onCreateProduct = ({
	dataProduct,
	dataFeatureProduct,
	filesData,
	fieldSelect,
	errorInput,
	createProduct,
}: {
	dataProduct: Record<string, number | string | null | undefined>;
	dataFeatureProduct: Record<string, number | string | null | undefined>;
	filesData: Array<any>;
	fieldSelect: string;
	errorInput: Record<string, any>;
	createProduct: (args: any) => void;
}) => {
	console.log('🚀 ~ fieldSelect:', fieldSelect?.split(',')[0]);
	for (const [key, value] of Object.entries({ ...dataProduct, ...dataFeatureProduct })) {
		if (value === null || value === '') {
			return ToastWarn(key.split(':')[0] + ' est obligatoire');
		} else if (typeof value === 'number' && value < 0) {
			return ToastWarn('Le champ ' + key.split(':')[0] + ' doit être supérieur à 0');
		}
	}
	for (const [key, value] of Object.entries(errorInput)) {
		if (value) {
			return ToastWarn(key.split(':')[0] + ' est mal défini');
		}
	}
	if (filesData.length == 0) {
		return ToastWarn('Vous devez ajouter au moins une image.');
	}
	if (!fieldSelect) {
		return ToastWarn('Vous devez sélectionner une catégorie');
	}
	const len = fieldSelect?.split(',').length;
	try {
		createProduct({
			dataProduct: {
				...dataProduct,
				featuresProduct: dataFeatureProduct,
				category_id: fieldSelect?.split(',')[len - 1],
			},
			photos: filesData,
		});
	} catch (error) {
		console.error('Erreur lors de la soumission du produit:', error);
		ToastWarn('Une erreur est survenue lors de la soumission du produit.');
	}
};
export const ProductSchema = z.object({
	title: z
		.string()
		.min(3, { message: 'titre doit contenir au moins 3 caractere' })
		.max(40, { message: 'titre trop long' }),
	description: z
		.string()
		.min(10, { message: 'description doit contenir au moins 10 caractere' })
		.max(1300, { message: 'description trop longue' }),
	price: z.string().refine((val) => !Number.isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 0, {
		message: "le prix n'est pas valide",
	}),
});
export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type CatCreateType = Omit<CategoryType[0], 'created_at' | 'updated_at'>;
export function validField(rule: f_form_type, caracteristique: { [k: string]: string | number }) {
	const nameId = rule.feature_id ? `${rule.name}:${rule.feature_id}` : `${rule.name}`;
	const value = caracteristique[nameId];
	if (value !== undefined) {
		if (rule.collect_type === 'select') {
			if (typeof value !== 'string') {
				throw new Error(`${rule.name} doit être une chaîne de caractères.`);
			} else {
				if (rule.enum && !(rule.enum as string[]).includes(value)) {
					throw new Error(`${value} n'est pas une valeur valide pour ${rule.name}.`);
				}
				if (rule.max && value.length > Number(rule.max)) {
					throw new Error(`${rule.name} doit avoir au maximum ${rule.max} caractères.`);
				}
				if (rule.min && value.length < Number(rule.min)) {
					throw new Error(`${rule.name} doit avoir au moins ${rule.min} caractères.`);
				}
				if (rule.match && !new RegExp(rule.match).test(value)) {
					throw new Error(`${rule.name} ne correspond pas au format requis.`);
				}
			}
		} else if (rule.collect_type === 'text' || rule.collect_type === 'textarea') {
			if (typeof value !== 'string') {
				throw new Error(`${rule.name} doit être une chaîne de caractères.`);
			} else {
				if (rule.max && value.length > Number(rule.max)) {
					throw new Error(`${rule.name} doit avoir au maximum ${rule.max} caractères.`);
				}
				if (rule.min && value.length < Number(rule.min)) {
					throw new Error(`${rule.name} doit avoir au moins ${rule.min} caractères.`);
				}
				if (rule.match && !new RegExp(rule.match).test(value)) {
					throw new Error(`${rule.name} ne correspond pas au format requis.`);
				}
				//invalid url in text input
				if (
					new RegExp(
						/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/gi
					).test(value)
				) {
					throw new Error(`${rule.name} contient une url`);
				}
			}
		} else if (rule.collect_type === 'number') {
			const v = new RegExp(/^-?\d*$/).test(String(value)) ? Number(value) : NaN;
			if (isNaN(v)) {
				throw new Error(`${rule.name} doit être un nombre.`);
			} else {
				if (rule.enum && rule.enum?.length !== 0 && !(rule.enum as any[]).includes(v)) {
					throw new Error(`${v} n'est pas une valeur valide pour ${rule.name}.`);
				}
				if (rule.max !== undefined && v > Number(rule.max)) {
					throw new Error(`${rule.name} doit être au maximum ${rule.max}.`);
				}
				if (rule.min !== undefined && v < Number(rule.min)) {
					throw new Error(`${rule.name} doit être au minimum ${rule.min}.`);
				}
				if (v < 0) {
					throw new Error(`${rule.name} ne doit pas être un nombre négatif.`);
				}
			}
		} else if (rule.collect_type === 'date') {
			if (!isDate(value)) {
				throw new Error(`${rule.name} doit être une date valide (aaaa-mm-jj).`);
			} else {
				if (rule.enum && !(rule.enum as string[]).includes(String(value))) {
					throw new Error(`${value} n'est pas une date valide pour ${rule.name}.`);
				}
				if (rule.max && new Date(value) > new Date(rule.max)) {
					throw new Error(`${rule.name} doit être avant le ${new Date(rule.max).toLocaleDateString()}.`);
				}
				if (rule.min && new Date(value) < new Date(rule.min)) {
					throw new Error(`${rule.name} doit être après le ${new Date(rule.min).toLocaleDateString()}.`);
				}
			}
		} else if (rule.collect_type === 'boolean') {
			if (typeof value !== 'boolean') {
				throw new Error(`${rule.name} doit être vrai ou faux.`);
			}
		}
	} else {
		if (rule.required === 1) {
			throw new Error(`${rule.name} est requis.`);
		}
	}
}
function isDate(a: any): a is string {
	try {
		if (typeof a == 'string') {
			const date = Date.parse(a);
			if (Number.isNaN(date)) return false;
		} else {
			return false;
		}
	} catch (error) {
		return false;
	}
	return true;
}

export const handleConnect = (e: any) => {
	e.preventDefault();
	const screenWidth = window.screen.width;
	const screenHeight = window.screen.height;
	const windowWidth = Math.min(screenWidth * 0.8, 500);
	const windowHeight = Math.min(screenHeight * 0.8, 600);
	const windowLeft = Math.round((screenWidth - windowWidth) / 2);
	const windowTop = Math.round((screenHeight - windowHeight) / 2);
	window.open(
		'/connexion',
		'_blank',
		`toolbar=yes,scrollbars=yes,resizable=yes,top=${windowTop},left=${windowLeft},width=${windowWidth},height=${windowHeight}`
	);
};

export function ToastError(message: string) {
	toast.error(message, {
		position: 'top-center',
		style: {
			border: '1px solid #7f1d1d',
			padding: '16px',
			backgroundColor: '#ef4444',
			color: '#fff',
		},
	});
}

export function ToastSuccess(message: string) {
	toast.success(message, {
		position: 'top-center',
		style: {
			border: '1px solid #713200',

			padding: '16px',
			color: '#713200',
		},
	});
}
export function ToastLoading(message: string, myPromise: Promise<any>) {
	toast.promise(
		myPromise,
		{
			loading: 'Loading',
			success: message,
			error: 'Error when fetching',
		},
		{
			style: {
				minWidth: '250px',
			},
			success: {
				duration: 5000,
				icon: '🔥',
			},
			error: {
				duration: 5000,
				icon: '',
			},
		}
	);
}
export function ToastWarn(message: string) {
	toast.error(message, {
		position: 'top-center',
		style: {
			border: '1px solid #713200',
			padding: '16px',
			color: '#713200',
		},
	});
}

export function ToastInfo(message: string) {
	toast.success(message, {
		position: 'top-center',
		style: {
			border: '1px solid #713200',
			padding: '16px',
			color: '#713200',
		},
	});
}

export function formatPrice(price: number): string {
	return price.toLocaleString('fr-FR', {
		style: 'currency',
		currency: 'CFA',
		maximumFractionDigits: 0,
		minimumFractionDigits: 0,
		minimumIntegerDigits: 1,
	});
}
export const capitalizeFirstLetter = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

export function getStatusByLevel(level: number): StatusType[] {
	switch (level) {
		case 0:
			return ['AWAIT'];
		case 1:
			return ['VALID'];
		case 2:
			return ['REJECTED'];
		case 3:
			return ['DELETED'];
		case 4:
			return ['PAUSE'];
		case 5:
			return ['AWAIT', 'DELETED', 'PAUSE', 'REJECTED', 'VALID'];
		default:
			return ['VALID'];
	}
}
