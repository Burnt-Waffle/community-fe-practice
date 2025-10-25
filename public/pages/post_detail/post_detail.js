import { loadHeader } from '../../components/header/header.js';
import { fetchPost, toggleLike } from '../../../api/postRequest.js';
import { fetchcomments } from '../../../api/commentRequest.js';
import { createPostElement } from '../../components/post/createPostElement.js';
import { createCommentElement } from '../../components/comment/createCommentElement.js';
import { postComment } from '../../../api/commentRequest.js';

let nextPage = 0;
const pageSize = 10;
let isLastPage = false;
let isLoading = false;
let currentPostId = null;

const loadMoreButton = document.getElementById('load-more-button');
const commentInputBox = document.getElementById('comment-input-box');
const commentPostButton = document.getElementById('comment-button');
const charCounter = document.getElementById('char-counter');
const MAX_COMMENT_LENGTH = 2000;
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

    loadMoreButton.addEventListener('click', () => loadComments(currentPostId));
    commentPostButton.addEventListener('click', () => handlePostComment(currentPostId));
    commentInputBox.addEventListener('input', updateCommentButtonState);
    updateCommentButtonState();
});

const loadPost = async (postId) => {
    try {
        const postData = await fetchPost(postId);
        const post = createPostElement(postData);
        const postPlaceholder = document.querySelector('.post-placeholder')
        postPlaceholder.innerHTML = '';
        postPlaceholder.appendChild(post)

        const likeButton = document.getElementById('like-button');
        if(likeButton) {
            likeButton.addEventListener('click', () => handleLikeClick(postId));
        }
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
        const commentData = await fetchcomments(postId, { page: nextPage, size: pageSize });
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

const updateCommentButtonState = () => {
    const currentLength = commentInputBox.value.length;
    const contentTrimmed = commentInputBox.value.trim();

    charCounter.textContent = `${currentLength} / ${MAX_COMMENT_LENGTH}`;

    if (contentTrimmed.length === 0) {
        commentPostButton.disabled = true;
    } else {
        commentPostButton.disabled = false;
    }
};

const handlePostComment = async (postId) => {
    const content = commentInputBox.value;

    if (content.trim().length === 0) {
        alert('댓글 내용을 입력해주세요.')
        return;
    }

    try {
        await postComment(postId, content);
        commentInputBox.value='';
        updateCommentButtonState();
        window.location.reload();
    } catch (error) {
        console.error('댓글 등록 실패:', error);
        alert(`댓글 등록에 실패했습니다. ${error.message}`);
    }
};

const handleLikeClick = async(postId) => {
    try {
        const result = await toggleLike(postId);

        const likeCountElement = document.getElementById('like-count');
        const likeButton = document.getElementById('like-button');

        if (!likeButton || !likeCountElement) return;

        likeCountElement.textContent = `좋아요 ${result.likeCount}`;
        likeButton.classList.toggle('liked', result.isLikedByCurrentUser);
    } catch (error) {
        console.error('좋아요 처리 실패:', error);
        alert(`좋아요 처리에 실패했습니다: ${error.message}`);
    }
};