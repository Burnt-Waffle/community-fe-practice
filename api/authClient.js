import { API_BASE_URL } from "../utils/config.js";

let isRefreshing = false;
let refreshPromise = null;

// 인증 토큰을 포함하여 API 요청을 보내는 범용 fetch 함수
export const authFetch = async (endpoint, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');

    const makeRequest = async (token) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        // 토큰이 있는 경우 Authorization 헤더 추가
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });
    };

    let response = await makeRequest(accessToken);

    // 응답이 실패했고 그 이유가 401 Unauthorized 이라면
    if (!response.ok && response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            // Promise를 사용하여 갱신 결과를 저장
            refreshPromise = refreshToken().finally(() => {
                isRefreshing = false;
                refreshPromise = null;
            });
        }

        try {
            // 진행 중인 갱신 작업이 끝나기를 기다림
            const newAccessToken = await refreshPromise;
            // 갱신된 토큰으로 원래 요청 재시도
            response = await makeRequest(newAccessToken);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: '재시도 요청 실패' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

        } catch (refreshError) {
            // refreshToken 함수 내부 또는 재시도 요청에서 에러 발생 시
            console.error("Refresh or retry failed:", refreshError);
            console.error(">>> authFetch caught refreshError:", refreshError);
            throw new Error('인증 갱신 또는 재시도에 실패했습니다. 다시 로그인해주세요.');
        }
    } else if (!response.ok) {
        // 401 외 다른 에러 처리
        const errorData = await response.json().catch(() => ({ message: '서버 에러 발생' }));
        console.error(">>> authFetch caught other error:", response.status, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response;
};

export const logoutUser = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/public/pages/login/login.html';
};

const refreshToken = async () => {
    const currentRefreshToken = localStorage.getItem('refreshToken');
    if (!currentRefreshToken) {
        throw new Error('No refresh token available.');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/reissue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: currentRefreshToken })
        });

        if (!response.ok) {
            console.error(">>> refreshToken request failed with status:", response.status);
            throw new Error('Failed to refresh token.');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        return data.accessToken;

    } catch (error) {
        console.error('Token refresh error:', error);
        console.error('>>> refreshToken caught error:', error);
        // 갱신 실패 시 로그아웃 처리
        logoutUser();
        throw error;
    }
}