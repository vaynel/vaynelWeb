document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('.v62_2'); // 로그인 폼 선택
    const loginButton = document.querySelector('.v62_14'); // 로그인 버튼 선택

    loginButton.addEventListener('click', function (event) {
        event.preventDefault(); // 폼의 기본 제출 동작 방지

        // 폼 데이터 수집
        const formData = new FormData(loginForm);
        const userData = {
            id: formData.get('id'),
            password: formData.get('password')
        };

        // CSRF 토큰 읽기
        const csrfToken = formData.get('_csrf');

        // axios를 사용하여 서버에 POST 요청 보내기
        axios.post('/login', userData, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken  // CSRF 토큰 헤더에 추가
            }
        })
            .then(response => {
                console.log(response);
                if (response.data.success) {
                    localStorage.setItem('token', response.data.token); // 토큰 저장
                    window.location.href = '/main'; // 리디렉션
                } else {
                    alert('로그인 실패: ' + response.data.message);
                }
            })
            .catch(error => {
                console.error('로그인 에러:', error);
                alert('로그인 과정에서 에러가 발생했습니다.');
            });
    });

    document.getElementById('bt_pwfind').addEventListener('click', () => {
        var userId = document.querySelector('input[name="id"]').value;
        const loginForm = document.querySelector('.v62_2'); // 로그인 폼 선택
        const formData = new FormData(loginForm);
        const csrfToken = formData.get('_csrf');
        console.log(csrfToken)
        if (!userId) {
            alert('Please enter your ID.');
            return;
        }
        axios.post('/reset-password', { id: userId }, {
            headers: {
                'X-CSRF-TOKEN': csrfToken  // CSRF 토큰 헤더에 추가
            }
        }
        )
            .then(response => {
                alert('Temporary password has been sent to your email.');
            })
            .catch(error => {
                console.error('Reset password error:', error);
                alert('Failed to reset password.');
            });
    })

});


