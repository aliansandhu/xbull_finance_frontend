export const slugToText = (slug) => {
    if (!slug) return "";

    return slug
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}