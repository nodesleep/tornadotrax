export default function loginClient() {
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');

	const raw = JSON.stringify({
		username: `${import.meta.env.VITE_APP_USER_NAME}`,
		password: `${import.meta.env.VITE_APP_JWT_SECRET}`,
	});

	const requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow',
	};

	// Return the fetch Promise chain
	return fetch(
		`${import.meta.env.VITE_APP_BASE_API}/auth/login`,
		requestOptions,
	)
		.then((response) => response.json())
		.then((result) => {
			return result.access_token; // Return the access token
		})
		.catch((error) => {
			console.error(error);
			throw error; // Re-throw the error to handle it outside this function if needed
		});
}
