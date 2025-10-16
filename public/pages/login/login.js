fetch('/public/components/header/header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header-placeholder').innerHTML = data;
            });

const emailInput = document.getElementById('id');
const passwordInput = document.getElementById('pw');
const loginButton = document.getElementById('login-button');
const helperText = document.getElementById('helper');

// 로그인 버튼의 이벤트 리스너
loginButton.addEventListener('click', async () => {
    // 입력된 이메일과 비밀번호 값 가져옴
    const email = emailInput.value;
    const password = passwordInput.value;

    // 비어있는지 확인
    if (!email) {
        helperText.textContent = '이메일을 입력해주세요.';
        emailInput.focus();
        return;
    }
    if (!password) {
        helperText.textContent = '비밀번호를 입력해주세요.';
        passwordInput.focus();
        return;
    }

    // 에러 메시지 초기화
    helperText.textContent = '';

    // 서버에 보낼 데이터
    const loginData = {
        email: email,
        password: password
    };

    // 서버에 로그인 요청
    try {
        const response = await fetch('http://localhost:8080/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData) // JSON 문자열로 변환하여 전송
        });

        if (response.ok) {
            // 로그인 성공 (HTTP 상태 코드가 200-299인 경우)
            alert('로그인 되었습니다!');
            // 메인 페이지나 다른 페이지로 이동
            window.location.href = '/'; // <-- 로그인 성공 후 이동할 페이지 주소 추가
        } else {
            // 로그인 실패 (서버에서 에러 응답을 보낸 경우)
            const errorData = await response.json(); // 에러 메시지를 JSON 형태로 받음
            helperText.textContent = errorData.message || '이메일 또는 비밀번호가 올바르지 않습니다.';
        }
    } catch (error) {
        // 네트워크 에러 등 fetch 요청 자체가 실패한 경우
        console.error('Login Error:', error);
        helperText.textContent = '로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
});