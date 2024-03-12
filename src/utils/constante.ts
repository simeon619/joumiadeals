export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const URL_IMAGE = "http://localhost:3000/fs/";
export const Nbr_Image_Upload = 7
export const LimitItemPaginate = 15

export const SeeAnnounce  = "J'ai vue votre annonce sur JoumiaDeals";
export const titleSite = "JoumiaDeals - Votre site de annonces en ligne"

export const headers = () => {
	const myHeaders = new Headers();
	myHeaders.append('Accept', 'application/json');
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);

	return myHeaders;
};
