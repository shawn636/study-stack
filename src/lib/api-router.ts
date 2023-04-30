import { PUBLIC_DEV_BASE_URL, PUBLIC_PROD_BASE_URL } from '$env/static/public';

export class ApiRouter {
	private base_url: string;

	constructor() {
		this.base_url =
			process.env.PUBLIC_ENV === 'PROD'
				? `${PUBLIC_PROD_BASE_URL}/api`
				: `${PUBLIC_DEV_BASE_URL}/svelte/api`;
	}

	public url(endpoint: string) {
		endpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
		return `${this.base_url}/${endpoint}`;
	}
}
