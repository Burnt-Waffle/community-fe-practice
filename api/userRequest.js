import { authFetch } from "./authClient.js";

const userAPIUrl = '/api/v1/users'

export const fetchCurrentUser = async () => {
    const response = await authFetch(`${userAPIUrl}/me`, {
        method: 'GET'
    })
    const data = await response.json();
    return data;
}

export const deleteCurrentUser = async () => {
    const response = await authFetch(`${userAPIUrl}/me`, {
        method: 'DELETE'
    })
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        } catch (parseError) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
}