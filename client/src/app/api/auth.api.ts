import { api } from "./baseURL";


export const authApi = {
    register: (data: {
        username: string;
        email: string;
        password: string;
    }) => api.post("/auth/register", data),

    login: (data: {
        username: string;
        password: string;
    }) => api.post("/auth/login", data),

    logout: (data: {
        email: string;
    }) => api.post("/auth/logout", data),

    checkAuth: (email: string) =>
        api.get("/auth/auth-check", {
            params: {
                email,
            },
        }),
};