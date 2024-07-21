type CloudflareErorr = { code: number; message: string };
type CloudflareMessage = { code: number; message: string };

type CloudflareResponse<T> = {
    errors: Array<CloudflareErorr>;
    messages: Array<CloudflareMessage>;
    result: T;
    success: boolean;
};

export type VerifyTokenResult = {
    expires_on?: string;
    id: string;
    not_before?: string;
    status: 'active' | 'disabled' | 'expired';
};

export type ImageUploadResult = {
    filename?: string;
    id?: string;
    meta?: { [key: string]: string };
    requireSignedURLs?: boolean;
    uploaded?: string;
    variants?: Array<string>;
};

export type VerifyTokenResponse = CloudflareResponse<VerifyTokenResult>;
export type ImageUploadResponse = CloudflareResponse<ImageUploadResult>;
export type ImageDeleteResponse = CloudflareResponse<null>;
