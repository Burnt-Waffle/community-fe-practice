import { authFetch } from "./authClient.js";

export const fetchPosts = async (options = {}) => {
    const config = {page: 0, size: 30, ...options};
    const response = await authFetch(`/api/v1/posts?page=${config.page}&size=${config.size}`, {
        method: 'GET'
    })
    if (!response.ok) {
        throw new Error('게시물 데이터를 가져오는 중에 오류가 발생했습니다.');
    }
    const data = await response.json();
    return data;
}
