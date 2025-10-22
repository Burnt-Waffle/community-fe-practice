import { loadHeader } from '../../components/header/header.js';
import { fetchPost } from '../../../api/postRequest.js';
import { fetchcomments } from '../../../api/commentRequest.js';
import { createPostElement } from '../../components/post/createPostElement.js';
import { createCommentElement } from '../../components/comment/createCommentElement.js'; 

let nextPage = 0;
const pageSize = 10;
let isLastPage = false;
let isLoading = false;
let currentPostId = null;

const loadMoreButton = document.getElementById('load-more-button');
const commentListContainer = document.getElementById('comment-list');

document.addEventListener('DOMContentLoaded', async () => {
    loadHeader({ showBackButton: true });
    const urlParams = new URLSearchParams(window.location.search);
    currentPostId = urlParams.get('id');
    if (currentPostId) {
        loadPost(currentPostId);
        loadComments(currentPostId);
    } else {
        console.error('Post ID not found in URL.')
        document.body.innerHTML = '<h1>게시물을 찾을 수 없습니다.</h1>'
    }
});

loadMoreButton.addEventListener('click', () => {
    loadComments(currentPostId);
})

const loadPost = async (postId) => {
    try {
        const postData = await fetchPost(postId);
        const post = createPostElement(postData);
        const postPlaceholder = document.querySelector('.post-placeholder')
        postPlaceholder.innerHTML = '';
        postPlaceholder.appendChild(post)
    } catch (err) {
        console.error(err);
        document.getElementById('post-placeholder').innerHTML =
            '<p>게시물을 불러오는 중 오류가 발생했습니다.</p>';
    }
}

const loadComments = async (postId) => {
    if (isLoading || isLastPage) return;
    isLoading = true;

    try {
        const commentData = await fetchcomments(postId, {page: nextPage, size: pageSize});
        isLastPage = commentData.last;
        nextPage = commentData.number + 1;
        appendComments(commentData.content);

        if (isLastPage) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }
        
    } catch (error) {
        console.error('댓글 로딩 중 에러 발생', error);
    } finally {
        isLoading = false;
    }
};

const appendComments = (comments) => {
    comments.forEach(comment => {
        const commentElement = createCommentElement(comment);
        commentListContainer.appendChild(commentElement);
    });
};