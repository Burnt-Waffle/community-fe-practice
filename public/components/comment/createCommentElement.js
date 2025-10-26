import { API_BASE_URL } from "../../../utils/config.js";
import { formatDate } from "../../../utils/function.js";

export const createCommentElement = ({ id, content, postId, authorNickname,
    authorProfileImageUrl, createdAt, updatedAt, author }) => {
    const container = document.createElement('div');
    container.className = 'comment-container';
    container.dataset.commentId = id;

    const formattedDate = formatDate(createdAt);

    let profileImageUrl = '';
    if (authorProfileImageUrl) {
        profileImageUrl = `${API_BASE_URL}${authorProfileImageUrl}`
    } else {
        profileImageUrl = '/assests/profile-default.png'
    }

    container.innerHTML = `
        <img class="comment-profile-image" src="${profileImageUrl}" alt="${authorNickname} 프로필">
        <div class="comment-body">
            <div class="comment-info">
                <span class="comment-author">${authorNickname}</span>
                <span class="comment-date">${formattedDate}</span>
                <div class="comment-actions">
                    <button class="comment-edit-button">수정</button>
                    <button class="comment-delete-button">삭제</button>
                </div>
            </div>
            <div class="comment-content">${content}</div>
        </div>
    `

    return container;
}