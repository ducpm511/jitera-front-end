import { authApi } from "./authApi";
import { IUserResponse } from "./types";

export const depositFn = async (id: string, data: any) => {
    const response = await authApi.patch<IUserResponse>(`users/${id}`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};
