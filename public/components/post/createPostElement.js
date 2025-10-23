import { API_BASE_URL } from "../../../utils/config.js";
import { formatDate } from "../../../utils/function.js";

export const createPostElement = ({ id, title, content, thumbnailUrl, imageUrls, authorNickname, authorProfileImageUrl,
    createdAt, updatedAt, viewCount, likeCount, commentCount, likedByCurrentUser }) => {
    const container = document.createElement('div');
    container.className = 'post-detail-container';
    container.dataset.id = id;
    
    const formattedDate = formatDate(createdAt);

    let profileImageUrl = '';
    if(authorProfileImageUrl){
        profileImageUrl = `${API_BASE_URL}${authorProfileImageUrl}`
    } else {
        profileImageUrl = '/assests/profile-default.png'
    }

    const imagesHtml = imageUrls.map(url => `<img src="${API_BASE_URL}${url}" alt="게시물 이미지"`).join()

    const likedClass = likedByCurrentUser ? 'liked' : '';

    container.innerHTML = `
        <h3 class="post-title">${title}</h3>
                <div class="post-header">
                    <img class="author-profile-image" src="${profileImageUrl}" alt="프로필 이미지">
                    <div class="author">${authorNickname}</div>
                    <div class="post-date">${formattedDate}</div>
                    <div class="buttons">
                        <button class="edit">수정</button>
                        <button class="delete">삭제</button>
                    </div>
                </div>
                <div class="post-main">
                    <div class="post-image">${imagesHtml}</div>
                    <div class="post-content">${content}</div>
                    <div class="post-meta">
                        <button class="like-button ${likedClass}" id="like-button">
                            <span class="count" id="like-count">좋아요: ${likeCount}</span>
                        </button>
                        <div class="comments">댓글: ${commentCount}</div>
                        <div class="views">조회수: ${viewCount}</div>
                    </div>
                </div>
    `
    return container;
}