import { API_BASE_URL } from "../../../utils/config.js";
import { formatDate } from "../../../utils/function.js";

export const createPostDetail = ({ id, title, content, thumbnailUrl, imageUrls, authorNickname, authorProfileImageUrl,
    createdAt, updatedAt, viewCount, likeCount, commentCount, }) => {
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
                        <div class="likes">${likeCount}</div>
                        <div class="comments">${commentCount}</div>
                        <div class="views">${viewCount}</div>
                    </div>
                </div>
    `
    return container;
}