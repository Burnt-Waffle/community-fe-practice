export function showInfoModal(message) {
    const modal = document.getElementById('infoModal');
    const messageEl = document.getElementById('modalMessage');
    const okButton = document.getElementById('modalOkButton');

    if (!modal || !messageEl || !okButton) {
        console.error("모달 HTML 요소가 페이지에 없습니다.");
        alert(message); 
        return Promise.resolve();
    }

    messageEl.textContent = message;
    modal.style.display = 'flex'; 

    return new Promise((resolve) => {
        okButton.onclick = () => {
            modal.style.display = 'none';
            resolve();
        };
    });
}

export function showConfirmModal(message) {
    const modal = document.getElementById('confirmModal');
    const messageEl = document.getElementById('confirmMessage');
    const okButton = document.getElementById('confirmOkButton');
    const cancelButton = document.getElementById('confirmCancelButton');

    if (!modal || !messageEl || !okButton || !cancelButton) {
        console.error("확인 모달 HTML 요소가 페이지에 없습니다.");
        return Promise.resolve(confirm(message)); 
    }

    messageEl.textContent = message;
    modal.style.display = 'flex';

    return new Promise((resolve) => {      
        okButton.onclick = () => {
            modal.style.display = 'none';
            resolve(true);
        };
        
        cancelButton.onclick = () => {
            modal.style.display = 'none';
            resolve(false);
        };
    });
}

export function showToast(message, duration = 3000) {
    const container = document.getElementById('toastContainer');

    if (!container) {
        console.error("토스트 컨테이너 HTML 요소가 페이지에 없습니다.");
        return; 
    }
    
    const toast = document.createElement('div');
    toast.classList.add('toast-item');
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration);
}