import { loadHeader } from '../../components/header/header.js';
import { fetchPosts } from '../../../api/postRequest.js';
import { createPostListElement } from '../../components/post/createPostListElement.js';
import { performSilentRefresh } from '../../../utils/silentRefresh.js';

const createPostButton = document.getElementById('create-post-button');

let nextPage = 0;
const pageSize = 30;
let isLastPage = false;
let isLoading = false;

// DOM이 완전히 로드된 후에 실행
document.addEventListener('DOMContentLoaded', async () => {
    await performSilentRefresh();
    loadHeader({ showBackButton: false });
    createPostButton.addEventListener('click', handleCreatePost)
    loadInitialPosts();
    window.addEventListener('scroll', handleScroll);
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

// 스크롤 감지
const handleScroll = () => {
    if (!isLoading &&
        (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
            loadMorePosts();
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

// 게시글 작성 페이지로 이동
const handleCreatePost = () => {
    window.location.href = '/public/pages/post_create/post_create.html';
}