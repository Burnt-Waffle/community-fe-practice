import { API_BASE_URL } from "../../../utils/config.js";
import {
    validateEmail,
    validateNickname,
    validatePassword,
    validatePasswordConfirm
} from "../../../utils/validation.js";
import { loadHeader } from "../../components/header/header.js";

const imagePreview = document.getElementById('profile-image-button');
const fileInput = document.getElementById('profile-image-upload');
const emailInput = document.getElementById('id');
const passwordInput = document.getElementById('pw');
const passwordConfirmInput = document.getElementById('pw-confirm');
const nicknameInput = document.getElementById('nickname');
const signupButton = document.getElementById('submit-button');

const emailHelper = document.getElementById('email-helper');
const passwordHelper = document.getElementById('password-helper');
const passwordConfirmHelper = document.getElementById('password-confirm-helper');
const nicknameHelper = document.getElementById('nickname-helper');

// DOM이 완전히 로드된 후에 스크립트를 실행
document.addEventListener('DOMContentLoaded', async () => {
    loadHeader({ showBackButton: true });
    updateSignupButtonState();
});

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

// 유효성 검사
const validateAllFields = () => {
    const isEmailValid = !validateEmail(emailInput.value);
    const isPasswordValid = !validatePassword(passwordInput.value);
    const isPasswordConfirmValid = !validatePasswordConfirm(passwordInput.value, passwordConfirmInput.value);
    const isNicknameValid = !validateNickname(nicknameInput.value);

    return isEmailValid && isPasswordValid && isPasswordConfirmValid && isNicknameValid;
}

// 버튼 활성화
const updateSignupButtonState = () => {
    signupButton.disabled = !validateAllFields();
}

// 각 입력 필드에서 포커스가 벗어났을 때 유효성 검사 실행
emailInput.addEventListener('blur', () => {
    const errorMessage = validateEmail(emailInput.value);
    emailHelper.textContent = errorMessage || '';
});
passwordInput.addEventListener('blur', () => {
    const errorMessage = validatePassword(passwordInput.value);
    passwordHelper.textContent = errorMessage || '';
});
passwordConfirmInput.addEventListener('blur', () => {
    const errorMessage = validatePasswordConfirm(passwordInput.value, passwordConfirmInput.value);
    passwordConfirmHelper.textContent = errorMessage || '';
});
nicknameInput.addEventListener('blur', () => {
    const errorMessage = validateNickname(nicknameInput.value);
    nicknameHelper.textContent = errorMessage || '';
});

// 키보드 입력할 때마다 버튼 상태 업데이트
[emailInput, passwordInput, passwordConfirmInput, nicknameInput].forEach(input => {
    input.addEventListener('input', updateSignupButtonState);
});

// 회원가입 버튼 클릭
signupButton.addEventListener('click', async () => {
    const signupData = {
        email: emailInput.value,
        password: passwordInput.value,
        passwordConfirm: passwordConfirmInput.value,
        nickname: nicknameInput.value,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signupData)
        });
        if (response.ok) {
            alert('회원가입 성공!');
            window.location.href = '/public/pages/login/login.html';
        } else {
            const errorData = await response.json();
            alert(errorData.message || '회원가입에 실패했습니다.');
        }
    } catch (error) {
        console.error('Signup Error:', error);
        alert('회원가입 중 문제가 발생했습니다.');
    }
});