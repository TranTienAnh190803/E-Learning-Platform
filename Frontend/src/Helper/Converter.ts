export const dateFormat = (date: Date): string => {
    const realDate = new Date(date);

    const year = realDate.getFullYear();
    const month = (realDate.getMonth() + 1).toString().padStart(2, "0");
    const day = realDate.getDate().toString().padStart(2, "0");

    return `${day}/${month}/${year}`;
}

export const dateTimeFormat = (date: Date): string => {
    const realDate = new Date(date);

    const year = realDate.getFullYear();
    const month = (realDate.getMonth() + 1).toString().padStart(2, "0");
    const day = realDate.getDate().toString().padStart(2, "0");

    return `${day}/${month}/${year}`;
}

export const objectToFormData = (object: object): FormData => {
    const formData = new FormData();

    Object.entries(object).forEach(([key, value]) => {
        if (value === null) {
        }
        else if (value instanceof File) {
            formData.append(key, value);
        }
        else if (Array.isArray(value)) {
            value.forEach(item => {
                formData.append(key, String(item))
            });
        }
        else {
            formData.append(key, String(value))
        }
    });

    return formData;
}