function logout() {
    const csrfToken = document.querySelector("#csrfToken").value; // CSRF 토큰 값 가져오기
    console.log(csrfToken);

    axios.post('/logout', {}, { // POST 요청 본문은 비어있으므로 빈 객체 전달
        headers: {
            'X-CSRF-TOKEN': csrfToken  // CSRF 토큰을 헤더에 올바르게 추가
        }
    })
    .then(() => {
        window.location.href = '/'; // 로그아웃 성공 시 로그인 페이지로 리다이렉트
    })
    .catch(error => {
        console.error('Logout failed:', error); // 로그아웃 실패 시 콘솔에 에러 로깅
        alert('로그아웃 실패'); // 사용자에게 로그아웃 실패 알림
    });
}


function fetchUserData() {
    axios.get('/current-user')
    .then(response => {
        if (response.data.success) {
            const userName = response.data.user.name;
            document.getElementById('username').textContent = userName; // 사용자 이름 업데이트
        }
    })
    .catch(error => {
        console.error('Failed to fetch user data:', error);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchUserData(); // 페이지 로드 시 사용자 데이터 요청
});


function navigateTo(url) {
    window.location.href = url;
}
