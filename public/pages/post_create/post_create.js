import { loadHeader } from "../../components/header/header.js";
import { createPost } from "../../../utils/postRequest.js";
import { performSilentRefresh } from "../../../utils/silentRefresh.js";
import { showInfoModal, showToast } from "../../components/layout/ui.js";

const form = document.getElementById('post-create-form');
const titleInput = document.getElementById('post-title');
const contentInput = document.getElementById('post-content');
const imageInput = document.getElementById('post-images');
const previewContainer = document.getElementById('image-preview-container');
const submitButton = document.getElementById('submit-button');
const charCounter = document.getElementById('content-char-counter');
const MAX_POST_LENGTH = 10000;

document.addEventListener('DOMContentLoaded' , async () => {
    await performSilentRefresh();
    await loadHeader({ showProfileButton: true, showBackButton: true });
    updateSubmitButtonState();
})

imageInput.addEventListener('change', () => {
    previewContainer.innerHTML = ''; 

    const files = Array.from(imageInput.files).slice(0, 5);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'image-preview';
            previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = '업로드 중...';

    try {
        const responseData = await createPost(titleInput.value, contentInput.value);
        if (responseData && responseData.id) {
            await showInfoModal('게시글이 성공적으로 등록되었습니다.');
            window.location.href = `/public/pages/post_detail/post_detail.html?id=${responseData.id}`;
        } else {
            showToast(responseData.message || '게시글 등록에 실패했습니다.');
        }
    } catch (error) {
        console.error('게시글 등록 중 에러 발생:', error);
        showToast(`게시글 등록 중 오류가 발생했습니다. ${error.message}`);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = '작성 완료';
    }
});

const updateSubmitButtonState = () => {
    const title = titleInput.value.trim();
    const content = contentInput.value;

    const currentLength = content.length;
    charCounter.textContent = `${currentLength} / ${MAX_POST_LENGTH}`;

    if (title.length > 0 && content.trim().length > 0) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
};

titleInput.addEventListener('input', updateSubmitButtonState);
contentInput.addEventListener('input', updateSubmitButtonState);