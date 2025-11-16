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

export const createPost = async (title, content, files) => {
    const formData = new FormData();

    const postData = {
        title: title,
        content: content,
    };

    formData.append('postData', new Blob([JSON.stringify(postData)], {
        type: "application/json"
    }))

    if (files && files.length >0) {
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
    }

    const response = await authFetch(`${postAPIUrl}`, {
        method: 'POST',
        body: formData
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
}