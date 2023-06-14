export const initials = (name: string) => {
    const names = name.split(' ');
    return names.length > 1 ? names[0][0] + names[names.length - 1][0] : names[0][0];
};
