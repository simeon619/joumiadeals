export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const headers = () => {
	const myHeaders = new Headers();
	myHeaders.append('Accept', 'application/json');
	myHeaders.append('Content-Type', 'application/json');
	myHeaders.append('Authorization', `Bearer ${localStorage.getItem('token')}`);

	return myHeaders;
};
