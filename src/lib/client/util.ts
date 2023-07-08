export const formatPhoneNumber = (inputNumber: string) => {
    // Remove any non-digit characters from the phone number
    const numericInput = inputNumber.replace(/\D/g, '');

    // Define the chunk sizes and initialize the result string
    const chunkSizes = [3, 3, 4];
    let result = '';

    // Apply chunk sizes and pad spaces between chunks
    let currentIndex = 0;
    for (let i = 0; i < chunkSizes.length; i++) {
        const chunkSize = chunkSizes[i];
        const chunk = numericInput.substr(currentIndex, chunkSize);

        if (chunk.length > 0) {
            result += chunk;

            if (currentIndex + chunkSize < numericInput.length) {
                result += ' ';
            }

            currentIndex += chunkSize;
        }
    }

    // Add extra space at the end if the last chunk is complete
    if (numericInput.length > currentIndex) {
        result += ' ';
    }

    return result;
};

export const initials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
};
