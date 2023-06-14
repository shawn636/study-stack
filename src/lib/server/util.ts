export const sleep = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
export const errorPadding = async () => {
    const minPadding = 100;
    const maxPaddingTime = 500;
    const paddingTime = Math.floor(Math.random() * (maxPaddingTime - minPadding + 1) + minPadding);
    await sleep(paddingTime);
};
