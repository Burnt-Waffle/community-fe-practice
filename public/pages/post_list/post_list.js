import { loadHeader } from '../../components/header/header.js';
import { fetchPosts } from '/api/postRequest.js'
import { createPostElement } from '../../components/post_preview/createPostElement.js';

// DOM이 완전히 로드된 후에 실행
document.addEventListener('DOMContentLoaded', async () => {
    loadHeader({ showBackButton: false });
    try {
        const posts = await fetchPosts();
        setPostList(posts);
    } catch (err) {
        console.error(err);
        document.getElementById('post-list').innerHTML =
            '<p>게시물 데이터를 불러오는 중 오류가 발생했습니다.</p>';
    }
});

const setPostList = (posts) => {
    const postListContainer = document.getElementById('post-list');
    postListContainer.innerHTML = '';

    posts.forEach(postData => {
        const postElement = createPostElement(postData);
        postElement.addEventListener('click', () => {
            alert('게시물 상세 페이지로 이동');
        });
        postListContainer.appendChild(postElement);
    });
};