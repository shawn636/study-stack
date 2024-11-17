export const fetchClientSecret = async () => {
    const response = await fetch('/api/checkout/creators/create-session', {
        method: 'POST',
        body: JSON.stringify({ lookup_key: 'creators-free' })
    });
    const { clientSecret } = await response.json();
    return clientSecret;
};
