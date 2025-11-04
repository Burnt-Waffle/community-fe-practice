import { authFetch, logoutUser } from "../../../api/authClient.js";
import { API_BASE_URL } from "../../../utils/config.js";
import { fetchCurrentUser, deleteCurrentUser } from "../../../api/userRequest.js";
import { validateNickname } from "../../../utils/validation.js";
import { loadHeader } from "../../components/header/header.js";
import { performSilentRefresh } from "../../../api/silentRefresh.js";
import { showInfoModal, showConfirmModal, showToast } from "../../components/layout/ui.js";

const imagePreview = document.getElementById('profile-image-button');
const fileInput = document.getElementById('profile-image-upload');
const nicknameInput = document.getElementById('nickname');
const nicknameHelper = document.getElementById('nickname-helper');
const submitButton = document.getElementById('submit-button');
const deleteButton = document.getElementById('delete-account-button');

document.addEventListener('DOMContentLoaded', async () => {
    await performSilentRefresh();
    await loadHeader({ showProfileButton: true, showBackButton: true });
    await loadUserData();
    updateSubmitButtonState();
});

const loadUserData = async () => {
    try {
        const userData = await fetchCurrentUser();

        const emailDisplay = document.getElementById('user-email');
        if (emailDisplay) {
            emailDisplay.textContent = userData.email;
        }
        nicknameInput.value = userData.nickname;

        if (userData.profileImageUrl) {
            imagePreview.src = `${API_BASE_URL}${userData.profileImageUrl}`;
        } else {
            imagePreview.src = '/assets/profile-default.png'
        }
    } catch (error) {
        console.error('회원 정보 로드 실패:', error);
        showToast('회원 정보를 불러오는 데 실패했습니다.')
    }
}

// 프로필 미리보기 이미지를 누르면 fileInput을 누른 것으로 간주
imagePreview.addEventListener('click', () => {
    fileInput.click();
});

// 프로필 미리보기 이미지 교체
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        // 파일 읽기가 완료되면 img의 src 변경해 이미지 업로드
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        // 취소를 누르면 다시 기본 이미지로 변경
        imagePreview.src = '/assets/profile-default.png';
    }
})

nicknameInput.addEventListener('blur', () => {
    const errorMessage = validateNickname(nicknameInput.value);
    nicknameHelper.textContent = errorMessage || '';
});

// 버튼 활성화
const updateSubmitButtonState = () => {
    submitButton.disabled = validateNickname(nicknameInput.value);
}

// 키보드 입력할 때마다 버튼 상태 업데이트
nicknameInput.addEventListener('input', updateSubmitButtonState);

// 수정하기 버튼 클릭
submitButton.addEventListener('click', async () => {
    const nicknameError = validateNickname(nicknameInput.value);
    if (nicknameError) {
        nicknameHelper.textContent = nicknameError;
        nicknameInput.focus();
        return;
    }

    submitButton.disabled = true;

    const changeData = {
        nickname: nicknameInput.value,
    };

    try {
        const response = await authFetch(`/api/v1/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changeData)
        });
        if (response.ok) {
            await showInfoModal('회원정보수정 성공!');
            location.replace(location.href)
        } else {
            const errorData = await response.json();
            nicknameHelper.textContent = errorData.message;
        }
    } catch (error) {
        console.error('Change User Info Error:', error);
        nicknameHelper.textContent = error.message;
    } finally {
        submitButton.disabled = false;
    };
});

deleteButton.addEventListener('click', async () => {
    const userConfirm = await showConfirmModal('정말로 이 댓글을 삭제하시겠습니까?');
    if (userConfirm('정말로 회원 탈퇴를 진행하시겠습니까?')) {
        try {
            const response = await deleteCurrentUser();
            await showInfoModal('회원 탈퇴가 완료되었습니다.');
            logoutUser();
        } catch (error) {
            console.error('Delete Account Error:', error);
            showToast(`회원 탈퇴 처리 중 문제가 발생했습니다. ${error.message}`);
        }
    }
})