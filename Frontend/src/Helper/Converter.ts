export const dateFormat = (date: Date): string => {
    const realDate = new Date(date);

    const year = realDate.getFullYear();
    const month = (realDate.getMonth() + 1).toString().padStart(2, "0");
    const day = realDate.getDate().toString().padStart(2, "0");

    return `${day}/${month}/${year}`;
}