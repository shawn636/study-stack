export async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json();

        throw new Error(error.message || 'API request failed');
    }
    return response.json();
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
