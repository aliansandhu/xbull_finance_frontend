export const textToSlug = (text) => {
    return text
        .toLowerCase() // Convert to lowercase
        .trim() // Remove spaces from start & end
        .replace(/[^a-z0-9 -]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Remove extra hyphens
};