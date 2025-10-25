import { authFetch } from "./authClient.js";

const userAPIUrl = '/api/v1/users'

export const fetchCurrentUser = async () => {
    const response = await authFetch(`${userAPIUrl}/me`, {
        method: 'GET'
    })
    const data = await response.json();
    return data;
}