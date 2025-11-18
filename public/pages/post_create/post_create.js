import { awsUploadUrl } from "../../../utils/config.js";
import { loadHeader } from "../../components/header/header.js";
import { createPost } from "../../../utils/postRequest.js";
import { performSilentRefresh } from "../../../utils/silentRefresh.js";
import { showInfoModal, showToast } from "../../components/layout/ui.js";
import { uploadImagesToS3 } from "../../../utils/imageFile.js";

const form = document.getElementById('post-create-form');
const titleInput = document.getElementById('post-title');
const contentInput = document.getElementById('post-content');
const imageInput = document.getElementById('post-images');
const previewContainer = document.getElementById('image-preview-container');
const submitButton = document.getElementById('submit-button');
const charCounter = document.getElementById('content-char-counter');
const MAX_POST_LENGTH = 10000;

let newFiles = [];

document.addEventListener('DOMContentLoaded' , async () => {
    await performSilentRefresh();
    await loadHeader({ showProfileButton: true, showBackButton: true });
    updateSubmitButtonState();
})

imageInput.addEventListener('change', () => {
    const files = Array.from(imageInput.files);
    newFiles = [...newFiles, ...files];

    imageInput.value = '';

    renderPreviews();
    updateSubmitButtonState();
});

const renderPreviews = () => {
    previewContainer.innerHTML = '';

    newFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            createPreviewElement(e.target.result, index);
        };
        reader.readAsDataURL(file);
    });
}

const createPreviewElement = (src, index) => {
    const container = document.createElement('div');
    container.className = 'preview-item';

    const img = document.createElement('img');
    img.src = src;
    
    const btn = document.createElement('button');
    btn.className = 'delete-btn';
    btn.innerHTML = '&#10005;';   // X 특수문자
    btn.type = 'button';

    btn.onclick = () => {
        newFiles.splice(index, 1);
        renderPreviews();
        updateSubmitButtonState();
    };

    container.appendChild(img);
    container.appendChild(btn);
    previewContainer.appendChild(container);
};

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = '업로드 중...';

    const title = titleInput.value;
    const content = contentInput.value;

    const files = imageInput.files;

    try {
        let imageUrls = [];

        if (newFiles.length > 0) {
            imageUrls = await uploadImagesToS3(newFiles, awsUploadUrl);
            if (!imageUrls || imageUrls.length === 0) {
                throw new Error('이미지 업로드에 실패했습니다.');
            }
        }

        submitButton.textContent = '게시글 저장 중...';

        const responseData = await createPost(title, content, imageUrls);
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