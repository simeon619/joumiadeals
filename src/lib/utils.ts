import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const  redirectToConnect = () => {
  window.location.href = 'http://localhost:3000/google_connexion';
}
export function truncateFirstName(name : string | undefined | null) {
  if (!name) {
    return '*_*';
  }
  const firstName = name.split(' ')[0];
  return firstName.slice(0, 8);
}


export const setItemLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getItemLocalStorage = <T>(key: string): T | null => {
  const item = localStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : null;
}