document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', function () {
        axios.post('/logout', {}, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('input[name="_csrf"]').value  // CSRF 토큰 헤더에 추가
            }
        })
        .then(response => {
            if (response.data.success) {
                localStorage.removeItem('token'); // 토큰 삭제
                window.location.href = '/login'; // 로그인 페이지로 리디렉션
            } else {
                alert('로그아웃 실패: ' + response.data.message);
            }
        })
        .catch(error => {
            console.error('로그아웃 에러:', error);
            alert('로그아웃 과정에서 에러가 발생했습니다.');
        });
    });
});
