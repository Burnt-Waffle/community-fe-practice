import { authFetch } from "./authClient.js";

export const fetchPosts = async () => {
    const response = await authFetch('/api/v1/posts', {
        method: 'GET'
    })
    if (!response.ok) {
        throw new Error('게시물 데이터를 가져오는 중에 오류가 발생했습니다.');
    }
    const data = await response.json();
    return data.content;
}