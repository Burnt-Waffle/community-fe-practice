const BASE_URL = 'http://localhost:8080';

// 인증 토큰을 포함하여 API 요청을 보내는 범용 fetch 함수
export const authFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('accessToken');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    // 토큰이 있는 경우 Authorization 헤더 추가
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // TODO: 토큰 갱신 로직 추가
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '서버와 통신 중 에러가 발생했습니다.' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response;
};