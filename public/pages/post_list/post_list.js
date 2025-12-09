import { loadHeader } from '../../components/header/header.js';
import { fetchPosts } from '../../../utils/postRequest.js';
import { createPostListElement } from '../../components/post/createPostListElement.js';
import { performSilentRefresh } from '../../../utils/silentRefresh.js';

const createPostButton = document.getElementById('create-post-button');

let nextPage = 0;
const pageSize = 10;
let isLastPage = false;
let isLoading = false;

// DOM이 완전히 로드된 후에 실행
document.addEventListener('DOMContentLoaded', async () => {
    await performSilentRefresh();
    await loadHeader({ showProfileButton: true, showBackButton: false });
    await loadInitialPosts();
    createPostButton.addEventListener('click', handleCreatePost)
    intersectionObserver();
});

// 처음 게시글 목록 로딩
const loadInitialPosts = async () => {
    if (isLoading) return;
    isLoading = true;

    try {
        const posts = await fetchPosts({ page: 0, size: pageSize });
        nextPage = posts.number + 1;
        isLastPage = posts.last;
        setPostList(posts.content);
    } catch (err) {
        console.error(err);
        document.getElementById('post-list').innerHTML =
            '<p>게시물 데이터를 불러오는 중 오류가 발생했습니다.</p>';
    } finally {
        isLoading = false;
    }
}

// 추가 게시글 로드
const loadMorePosts = async () => {
    if (isLoading || isLastPage) return;
    isLoading = true;

    try {
        const posts = await fetchPosts({page: nextPage, size: pageSize});
        nextPage = posts.number + 1;
        isLastPage = posts.last;
        appendPosts(posts.content);
    } catch (err) {
        console.error(err);
    } finally {
        isLoading = false;
    }
}

// 목록 초기 로딩
const setPostList = (posts) => {
    const postListContainer = document.getElementById('post-list');
    postListContainer.innerHTML = '';
    appendPosts(posts);
};

// 목록에 게시글 추가
const appendPosts = (posts) => {
    const postListContainer = document.getElementById('post-list');
    posts.forEach(postData => {
        const postElement = createPostListElement(postData);
        postElement.addEventListener('click', () => {
            const postId = postElement.dataset.id;
            window.location.href = `/public/pages/post_detail/post_detail.html?id=${postId}`;
        });
        postListContainer.appendChild(postElement);
    });
}

const intersectionObserver = () => {
    const sentinel = document.getElementById('scroll-sentinel');
    if (!sentinel) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0
    }

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading && !isLastPage) {
                loadMorePosts();
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(sentinel);
}

// 게시글 작성 페이지로 이동
const handleCreatePost = () => {
    window.location.href = '/public/pages/post_create/post_create.html';
}