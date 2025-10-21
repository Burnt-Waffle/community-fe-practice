import { loadHeader } from '../../components/header/header.js';
import { fetchPost } from '../../../api/postRequest.js';
import { createPostDetail } from '../../components/post/createPostElement.js';

document.addEventListener('DOMContentLoaded', async () => {
    loadHeader({ showBackButton: true });
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    if (postId) {
        loadPost(postId);
    } else {
        console.error('Post ID not found in URL.')
        document.body.innerHTML = '<h1>게시물을 찾을 수 없습니다.</h1>'
    }
});

const loadPost = async (postId) => {
    try {
        const postData = await fetchPost(postId);
        const postDetail = createPostDetail(postData);
        const postPlaceholder = document.querySelector('.post-placeholder')
        postPlaceholder.innerHTML = '';
        postPlaceholder.appendChild(postDetail)
    } catch (err) {
        console.error(err);
        document.getElementById('post-placeholder').innerHTML =
            '<p>게시물을 불러오는 중 오류가 발생했습니다.</p>';
    }
}