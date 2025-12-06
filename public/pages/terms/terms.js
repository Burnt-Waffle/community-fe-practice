import { API_BASE_URL } from "../../../utils/config.js";
import { loadHeader } from "../../components/header/header.js";

const termListElement = document.getElementById('term-list');
const nextButton = document.getElementById('next-button');
const checkAll = document.getElementById('check-all');

let termsData = [];

document.addEventListener('DOMContentLoaded', async () => {
    await loadHeader({
        showBackButton: true,
        showProfileButton: false,
        backUrl: '/public/pages/login/login.html'
    });
    await loadTerms();

    checkAll.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        const checkboxes = document.querySelectorAll('.term-checkbox');
        checkboxes.forEach(cb => {
            cb.checked = isChecked;
        });
        updateNextButtonState(); // 상태 변경 후 다음 버튼 활성화 여부 업데이트
    });

    nextButton.addEventListener('click', () => {
        window.location.href = '/public/pages/signup/signup.html';
    });
});

const loadTerms = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/terms`);
        if (!response.ok) throw new Error('약관 목록을 불러오는데 실패했습니다.');
        const terms = await response.json();
        renderTermList(terms);
    } catch (error) {
        console.error(error);
        termListElement.innerHTML = '<li>약관 정보를 불러올 수 없습니다.</li>';
    }
};

const renderTermList = (terms) => {
    termListElement.innerHTML = '';
    terms.forEach(term => {
        const li = document.createElement('li');

        // 체크박스 + 라벨 컨테이너
        const container = document.createElement('div');
        container.className = 'term-item-container';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `term-${term.id}`;
        checkbox.className = 'term-checkbox';

        checkbox.dataset.required = 'true';

        const label = document.createElement('label');
        label.htmlFor = `term-${term.id}`;
        label.textContent = `[필수] ${term.title}`;
        label.style.cursor = 'pointer';
        label.style.marginLeft = '8px';

        // 상세 보기 링크
        const link = document.createElement('a');
        link.href = `/public/pages/terms/terms_detail.html?id=${term.id}`;
        link.textContent = '상세보기 >';
        link.className = 'term-link';

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(link);

        li.appendChild(container);
        termListElement.appendChild(li);

        // 개별 체크박스 이벤트 리스너
        checkbox.addEventListener('change', updateNextButtonState);
    });
};

const updateNextButtonState = () => {
    const checkboxes = document.querySelectorAll('.term-checkbox');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    // 전체 동의 체크박스 상태 동기화
    checkAll.checked = allChecked;

    // 모든 필수 약관이 체크되었는지 확인
    if (allChecked) {
        nextButton.disabled = false;
    } else {
        nextButton.disabled = true;
    }
};