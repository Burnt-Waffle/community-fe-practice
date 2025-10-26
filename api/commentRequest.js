import { authFetch } from "./authClient.js";

const postAPIUrl = '/api/v1/posts'

export const fetchcomments = async (postId, options={}) => {
    const config = { page: 0, size: 10, ...options };
    const response = await authFetch(`${postAPIUrl}/${postId}/comments?page=${config.page}&size=${config.size}`, {
        method: 'GET'
    })
    const data = await response.json();
    return data;
}

export const postComment = async (postId, content) => {
    const commentData = {
        content: content
    };

    const response = await authFetch(`${postAPIUrl}/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify(commentData)
    });

    const data = await response.json();
    return data;
}

export const updateComment = async (postId, commentId, content) => {
    const commentData = {
        content: content
    };
    const response = await authFetch(`${postAPIUrl}/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        body: JSON.stringify(commentData)
    });
    const data = await response.json();
    return data;
}

export const deleteComment = async (postId, commentId) => {
    const response = await authFetch(`${postAPIUrl}/${postId}/comments/${commentId}`, {
        method: 'DELETE'
    });
}