export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new Error(
            'Request failed with status: ' + response.status + ' ' + response.statusText
        );
    }

    try {
        return response.json() as Promise<T>;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Failed to parse response: ' + error.message);
        } else {
            throw new Error('Failed to parse response');
        }
    }
}

/**
 * Fetch with timeout utility function.
 *
 * @param {string} url - The URL to fetch.
 * @param {RequestInit} options - The fetch options.
 * @param {number} timeout - The timeout in milliseconds.
 * @param {typeof fetch} fetchFn - The fetch function to use.
 * @returns {Promise<Response>} A promise that resolves to the response or rejects with an error.
 */
export async function fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = 5000,
    fetchFn: typeof fetch = fetch
): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    options.signal = controller.signal;

    try {
        const response = await fetchFn(url, options);
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (controller.signal.aborted) {
            return new Response(JSON.stringify({ message: 'Request timed out', status: 408 }), {
                status: 408
            });
        }
        throw error;
    }
}
