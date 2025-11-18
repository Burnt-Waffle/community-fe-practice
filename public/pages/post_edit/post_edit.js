import { loadHeader } from "../../components/header/header.js";
import { fetchPost, updatePost } from "../../../utils/postRequest.js";
import { performSilentRefresh } from "../../../utils/silentRefresh.js";
import { showInfoModal, showToast } from "../../components/layout/ui.js";
import { uploadImagesToS3 } from "../../../utils/imageFile.js";
import { awsUploadUrl } from "../../../utils/config.js";

const form = document.getElementById('post-edit-form');
const titleInput = document.getElementById('post-title');
const contentInput = document.getElementById('post-content');
const imageInput = document.getElementById('post-images');
const previewContainer = document.getElementById('image-preview-container');
const submitButton = document.getElementById('submit-button');
const charCounter = document.getElementById('content-char-counter');
const MAX_POST_LENGTH = 10000;

let currentPostId = null;

document.addEventListener('DOMContentLoaded' , async () => {
    await performSilentRefresh();
    await loadHeader({ showProfileButton: true, showBackButton: true });

    const urlParams = new URLSearchParams(window.location.search);
    currentPostId = urlParams.get('id');

    if (currentPostId) {
        await loadPostData(currentPostId);
    } else {
        await showInfoModal('잘못된 접근입니다.');
        window.location.href = '/public/pages/post_list/post_list.html';
    }

    updateSubmitButtonState();
})

const loadPostData = async(postId) => {
    try {
        const postData = await fetchPost(postId);

        titleInput.value = postData.title;
        contentInput.value = postData.content;

        if (postData.imageUrls && postData.imageUrls.length > 0) {
            existingImageUrls = postData.imageUrls;
            renderPreviews(); // 통합 렌더링 함수 호출
        }

        updateCharCounter();
    } catch (error) {
        console.error('게시글 정보 로드 실패:', error);
        showToast('게시글 정보를 불러오는 데 실패했습니다.');
    }
}

imageInput.addEventListener('change', () => {
    renderPreviews();
});

const renderPreviews = () => {
    previewContainer.innerHTML = '';

    existingImageUrls.forEach((url) => {
        const img = document.createElement('img');
        img.src = url;
        img.className = 'image-preview';
        previewContainer.appendChild(img);
    });

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
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = '수정 중...';

    try {
        const files = imageInput.files;
        let newImageUrls = [];

        if (files && files.length > 0) {
            newImageUrls = await uploadImagesToS3(files, awsUploadUrl);
            if (!newImageUrls) throw new Error('새 이미지 업로드 실패');
        }

        const finalImageUrls = [...existingImageUrls, ...newImageUrls];

        const responseData = await updatePost(currentPostId, titleInput.value, contentInput.value, finalImageUrls);
        if (responseData && responseData.id) {
            await showInfoModal('게시글 수정 완료!')
            window.location.href = `/public/pages/post_detail/post_detail.html?id=${responseData.id}`;
        } else {
            showToast(responseData.message || '게시글 수정에 실패했습니다.');
        }
    } catch (error) {
        console.error('게시글 수정 중 에러 발생:', error);
        showToast(`게시글 수정 중 오류가 발생했습니다. ${error.message}`);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = '작성 완료';
    }
});

const updateSubmitButtonState = () => {
    const title = titleInput.value.trim();
    const content = contentInput.value;

    updateCharCounter();

    if (title.length > 0 && content.trim().length > 0) {
        submitButton.disabled = false;
    } else {
        submitButton.disabled = true;
    }
};

const updateCharCounter = () => {
    const currentLength = contentInput.value.length;
    charCounter.textContent = `${currentLength} / ${MAX_POST_LENGTH}`;
}

titleInput.addEventListener('input', updateSubmitButtonState);
contentInput.addEventListener('input', updateSubmitButtonState);