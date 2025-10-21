import { authFetch } from "./authClient.js";

export const fetchPosts = async (options = {}) => {
    const config = {page: 0, size: 30, ...options};
    const response = await authFetch(`/api/v1/posts?page=${config.page}&size=${config.size}`, {
        method: 'GET'
    })
    const data = await response.json();
    return data;
}

export const fetchPost = async (postId) => {
    const response = await authFetch(`/api/v1/posts/${postId}`, {
        method: 'GET'
    })
    const data = await response.json();
    return data;
}