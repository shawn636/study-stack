export type ApiResponse<T> = {
    count: number;
    data: T;
    message?: string;
    object: string;
    success: boolean;
};
