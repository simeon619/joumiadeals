/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldOptionsType } from '@/services/api/product_categorie';
import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getRandomInt(min: number, max: number) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function redirectToConnect() {
	window.location.href = 'http://localhost:3000/google_connexion';
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

export function validField(
	rule: FieldOptionsType[0],
	caracteristique: { [k: string]: string | number }
) {
	const value = caracteristique[rule.name];
	if (value != undefined) {
		if (rule.type == 'string') {
			if (typeof value !== 'string')
				throw new Error(`'ERROR caracteristique.${rule.name} must be a string value`);
			else {
				if (rule.enum && !(rule.enum as string[]).includes(value))
					throw new Error(`ERROR ${rule.name}:${value}, is not in Enumeration`);
				if (rule.max && value.length > rule.max)
					throw new Error(
						`ERROR ${rule.name}:${value},  must be a value between [${rule.min ?? 0} , ${rule.max}]`
					);
				if (rule.min && value.length < rule.min)
					throw new Error(`ERROR ${rule.name}:${value},  must be a value > ${rule.min}`);
				if (rule.match && !new RegExp(rule.match[0], rule.match[1]).test(value))
					throw new Error(`ERROR ${rule.name}:${value},  regExp no match : ${rule.match}`);
			}
		} else if (rule.type == 'number') {
			const v = new RegExp(/^\d+$/).test(String(value)) ? Number(value) : '';
			if (typeof v !== 'number') {
				console.log('🚀 ~ trhox error', v);
				throw new Error(`'ERROR caracteristique.${rule.name} must be a number value`);
			} else {
				if (rule.enum && !(rule.enum as number[]).includes(v))
					throw new Error(`ERROR ${rule.name}:${v}, is not in Enumeration`);
				if (rule.max && v > rule.max)
					throw new Error(
						`ERROR ${rule.name}:${v},  must be a value between [${rule.min ?? 0} , ${rule.max} ]`
					);
				if (rule.min && v < rule.min)
					throw new Error(`ERROR ${rule.name}:${v},  must be a value > ${rule.min}`);
			}
		} else if (rule.type == 'date') {
			if (!isDate(value))
				throw new Error(`'ERROR caracteristique.${rule.name} must be a Date value, like "yyyy-mm-dd"`);
			else {
				if (rule.enum && !(rule.enum as string[]).includes(value))
					throw new Error(`ERROR ${rule.name}:${value}, is not in Enumeration`);
				if (rule.max && new Date(value) > new Date(rule.max))
					throw new Error(
						`ERROR ${rule.name}:${value},  must be a value between [${new Date(rule.min ?? 0).toDateString()} , ${new Date(rule.max).toDateString()} ]`
					);
				if (rule.min && new Date(value) < new Date(rule.min))
					throw new Error(
						`ERROR ${rule.name}:${value},  must be a value > ${new Date(rule.min).toDateString()}`
					);
			}
		} else if (rule.type == 'boolean' && typeof value !== 'boolean')
			throw new Error(`'ERROR caracteristique.${rule.name} must be a boolean value`);
	} else {
		if (rule.require == true) throw new Error('ERROR require ' + rule.name);
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
		'/login',
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

export function ToastWarn(message: string) {
	toast.info(message, {
		position: 'top-center',
		style: {
			border: '1px solid #713200',
			padding: '16px',
			color: '#713200',
		},
	});
}

export function ToastInfo(message: string) {
	toast.info(message, {
		position: 'top-center',
		style: {
			border: '1px solid #713200',
			padding: '16px',
			color: '#713200',
		},
	});
}

export function formatPrice(price: number) {
	return price.toLocaleString('fr-FR', {
		style: 'currency',
		currency: 'CFA',
		compactDisplay: 'long',
		maximumFractionDigits: 0,
		currencySign: 'accounting',
	});
}
export const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}