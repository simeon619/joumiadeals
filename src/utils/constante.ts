export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const URL_IMAGE = 'http://localhost:3000/fs/';
export const Nbr_Image_Upload = 7;
export const LimitItemPaginate = 15;

export const SeeAnnounce = "J'ai vue votre annonce sur AdjameDeals";
export const titleSite = 'adjameDeals - Votre site de annonces en ligne';

export const adviceTitleAnnouce = [
	'mettez ci-possible uniquement la marque/modele.',
	'soyez bref et concis.',
];

export const adviceDescription = [''];

export const headers = () => {
	const myHeaders = new Headers();
	myHeaders.append('Accept', 'application/json');
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);

	return myHeaders;
};
