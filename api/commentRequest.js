import { authFetch } from "./authClient.js";

export const fetchcomments = async (postId, options={}) => {
    const config = {page: 0, size: 10, ...options};
    const response = await authFetch(`/api/v1/posts/${postId}/comments?page=${config.page}&size=${config.size}`, {
        method: 'GET'
    })
    const data = await response.json();
    return data;
}