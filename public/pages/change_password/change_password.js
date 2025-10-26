import { API_BASE_URL } from "../../../utils/config.js";
import { loadHeader } from "../../components/header/header.js";
import { authFetch, logoutUser } from "../../../api/authClient.js";
import { validatePassword, validatePasswordConfirm } from "../../../utils/validation.js";

const currentPasswordInput = document.getElementById('pw');
const newPasswordInput = document.getElementById('new-pw');
const passwordConfirmInput = document.getElementById('pw-confirm');
const submitButton = document.getElementById('submit-button');

const currentPasswordHelper = document.getElementById('current-password-helper');
const newPasswordHelper = document.getElementById('new-password-helper');
const passwordConfirmHelper = document.getElementById('password-confirm-helper');

document.addEventListener('DOMContentLoaded', async () => {
    loadHeader({ showBackButton: true });
    updateSubmitButtonState();
});

// 유효성 검사
const validateAllFields = () => {
    const isPasswordValid = !validatePassword(currentPasswordInput.value);
    const isNewPasswordValid = !validatePassword(newPasswordInput.value);
    const isPasswordConfirmValid = !validatePasswordConfirm(newPasswordInput.value, passwordConfirmInput.value);

    return isPasswordValid && isNewPasswordValid && isPasswordConfirmValid;
}

// 버튼 활성화
const updateSubmitButtonState = () => {
    submitButton.disabled = !validateAllFields();
}

currentPasswordInput.addEventListener('blur', () => {
    const errorMessage = validatePassword(currentPasswordInput.value);
    currentPasswordHelper.textContent = errorMessage || '';
});
newPasswordInput.addEventListener('blur', () => {
    const errorMessage = validatePassword(newPasswordInput.value);
    newPasswordHelper.textContent = errorMessage || '';
});
passwordConfirmInput.addEventListener('blur', () => {
    const errorMessage = validatePasswordConfirm(newPasswordInput.value, passwordConfirmInput.value);
    passwordConfirmHelper.textContent = errorMessage || '';
});

// 키보드 입력할 때마다 버튼 상태 업데이트
[currentPasswordInput, newPasswordInput, passwordConfirmInput].forEach(input => {
    input.addEventListener('input', updateSubmitButtonState);
});

// 수정하기 버튼 클릭
submitButton.addEventListener('click', async () => {
    const currentPwError = validatePassword(currentPasswordInput.value);
    const newPwError = validatePassword(newPasswordInput.value);
    const confirmPwError = validatePasswordConfirm(newPasswordInput.value, passwordConfirmInput.value);

    currentPasswordHelper.textContent = currentPwError || '';
    newPasswordHelper.textContent = newPwError || '';
    passwordConfirmHelper.textContent = confirmPwError || '';

    if (currentPwError || newPwError || confirmPwError) return;

    submitButton.disabled = true;

    const changeData = {
        currentPassword: currentPasswordInput.value,
        newPassword: newPasswordInput.value,
        newPasswordConfirm: passwordConfirmInput.value
    };

    try {
        const response = await authFetch(`/api/v1/users/me/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changeData)
        });
        if (response.ok) {
            alert('비밀번호가 성공적으로 변경되었습니다. 변경된 비밀번호로 다시 로그인 해주세요.');
            logoutUser();
        } else {
            const errorData = await response.json();
            currentPasswordHelper.textContent = errorData.message || '현재 비밀번호가 틀렸습니다.';
        }
    } catch (error) {
        console.error('Change User Info Error:', error);
        currentPasswordHelper.textContent = error.message || '현재 비밀번호가 틀렸습니다.';
    } finally {
        submitButton.disabled = false;
    };
});