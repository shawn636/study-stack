/**
 * Delays execution for the specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to sleep.
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 */
export const sleep = async (ms: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

/**
 * Adds a random padding delay to simulate error conditions.
 */
export const errorPadding = async () => {
    const minPadding = 100;
    const maxPaddingTime = 500;
    const paddingTime = Math.floor(Math.random() * (maxPaddingTime - minPadding + 1) + minPadding);
    await sleep(paddingTime);
};
