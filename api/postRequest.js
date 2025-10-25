import { authFetch } from "./authClient.js";

const postAPIUrl = '/api/v1/posts' 

export const fetchPosts = async (options = {}) => {
    const config = {page: 0, size: 30, ...options};
    const response = await authFetch(`${postAPIUrl}?page=${config.page}&size=${config.size}`, {
        method: 'GET'
    })
    const data = await response.json();
    return data;
}

export const fetchPost = async (postId) => {
    const response = await authFetch(`${postAPIUrl}/${postId}`, {
        method: 'GET'
    })
    const data = await response.json();
    return data;
}

export const toggleLike = async (postId) => {
    const response = await authFetch(`${postAPIUrl}/${postId}/like`, {
        method: 'POST'
    });
    const data = await response.json();
    return data;
}

export const createPost = async (title, content) => {
    const postData = {
        title: title,
        content: content,
    };
    const response = await authFetch(`${postAPIUrl}`, {
        method: 'POST',
        body: JSON.stringify(postData)
    });
    const data = await response.json();
    return data;
}

export const updatePost = async (postId, title, content) => {
    const postUpdateData = {
        title: title,
        content: content
    };
    const response = await authFetch(`${postAPIUrl}/${postId}`, {
        method: 'PATCH',
        body: JSON.stringify(postUpdateData)
    });
    const data = await response.json();
    return data;
}

export const deletePost = async (postId) => {
    const response = await authFetch(`${postAPIUrl}/${postId}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    return data;
}