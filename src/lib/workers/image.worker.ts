onmessage = async (event) => {
    const src = event.data.src;
    try {
        const url = new URL(src, location.origin);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load image: ${response.status}`);
        }
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        postMessage({ img: objectURL });
    } catch (error) {
        postMessage({ error: 'Unable to load image' });
    }
};

export {};
