export const loadHeader = async () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) {
        return;
    }

    try {
        const response = await fetch('/public/components/header/header.html');
        if (!response.ok) {
            throw new Error(`HTTP error satus: ${response.status}`);
        }
        const headerHtml = await response.text();

        headerPlaceholder.innerHTML = headerHtml;

        // 뒤로가기 버튼 설정
        const backButton = document.getElementById('back-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                history.back();
            });
        }

        // 프로필 이미지 버튼 설정
        const profileButton = document.getElementById('profile-button');
        const dropdownMenu = document.querySelector('.header-dropdown-menu')
        if (profileButton && dropdownMenu) {
            profileButton.addEventListener('click', (event) => {
                event.stopPropagation();
                dropdownMenu.classList.toggle('is-active');
            });
        }

        // 로그아웃 버튼 설정
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                // 로그아웃 로직 추가 (토큰 제거)
                alert('로그아웃 되었습니다.');
                window.location.href = '/public/pages/login/login.html';
            });
        }

        // 페이지 아무곳이나 클릭하면 드롭다운 메뉴 제거
        document.addEventListener('click', () => {
            if (dropdownMenu && dropdownMenu.classList.contains('is-active')) {
                dropdownMenu.classList.remove('is-active');
            }
        });

    } catch (error) {
        console.error('헤더를 불러오는 데 실패했습니다:', error);
        headerPlaceholder.textContent = '헤더를 불러올 수 없습니다.';
    }
}