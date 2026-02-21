import axios from "../../Configurations/AxiosCoreService.ts";
import type { ApiResponse } from "../../Types/Common.type.ts";

export const readFile = async (formData: FormData): Promise<ApiResponse<void> | Blob> => {
    const response = await axios.post("/file-api/public/read-file", formData, {
        responseType: "blob"
    });
    return response.data;
}