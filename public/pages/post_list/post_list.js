import { loadHeader } from '../../components/header/header.js';
import { fetchPosts } from '/api/postRequest.js'
import { createPostElement } from '../../components/post_preview/createPostElement.js';

let nextPage = 0;
const pageSize = 30;
let isLast = false;
let isLoading = false;

// DOM이 완전히 로드된 후에 실행
document.addEventListener('DOMContentLoaded', async () => {
    loadHeader({ showBackButton: false });
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
        isLast = posts.last;
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
    if (isLoading || isLast) return;
    isLoading = true;

    try {
        const posts = await fetchPosts({page: nextPage, size: pageSize});
        nextPage = posts.number + 1;
        isLast = posts.last;
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
        const postElement = createPostElement(postData);
        postElement.addEventListener('click', () => {
            alert('게시물 상세 페이지로 이동');
        });
        postListContainer.appendChild(postElement);
    });
}