// import type {
//     ImageDeleteResponse,
//     ImageUploadResponse,
//     VerifyTokenResponse
// } from '$lib/server/cdn.types';

// import { CLOUDFLARE_IMAGES_API_KEY } from '$env/static/private';

// class CDN {
//     private accountId = '96a15b836dab51a8041483dc091bdc9b';
//     private headers: Record<string, string>;
//     private token: string;
//     baseUrl = 'https://api.cloudflare.com/client/v4';

//     constructor(token: string) {
//         this.token = token;
//         this.headers = { Authorization: `Bearer ${this.token}` };

//         if (!this.verifyToken) {
//             throw new Error('Unable to verify token. Please check your API key.');
//         }
//     }

//     private async fetch(url: string, options?: RequestInit): Promise<Response> {
//         const mergedOptions = {
//             ...options,
//             headers: {
//                 ...this.headers,
//                 ...options?.headers
//             }
//         };
//         const fetchUrl = this.baseUrl + url;

//         return fetch(fetchUrl, mergedOptions);
//     }

//     private async verifyToken(): Promise<VerifyTokenResponse> {
//         const response = await this.fetch('/user/tokens/verify', {
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             method: 'GET'
//         });

//         const data = (await response.json()) as VerifyTokenResponse;

//         return data;
//     }

//     async deleteImage(imageId: string): Promise<ImageDeleteResponse> {
//         if (!imageId) {
//             return { errors: [], messages: [], result: null, success: false };
//         }

//         const response = await this.fetch(`/accounts/${this.accountId}/images/v1/${imageId}`, {
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             method: 'DELETE'
//         });

//         const data = (await response.json()) as ImageDeleteResponse;
//         return data;
//     }

//     async uploadImage(file: File): Promise<ImageUploadResponse> {
//         const formData = new FormData();
//         formData.append('file', file);

//         const response = await this.fetch(`/accounts/${this.accountId}/images/v1`, {
//             body: formData,
//             method: 'POST'
//         });

//         const data = (await response.json()) as ImageUploadResponse;

//         return data;
//     }
// }

// export const cdn = new CDN(CLOUDFLARE_IMAGES_API_KEY);
