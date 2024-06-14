document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.querySelector('.v78_8');
    const signupButton = document.querySelector('#bt_signup');

    signupButton.addEventListener('click', function (event) {
        event.preventDefault();

        const formData = new FormData(signupForm);
        const userData = {};
        formData.forEach((value, key) => {
            userData[key] = value;
        });

        const csrfToken = formData.get('_csrf');

        axios.post('/signup', JSON.stringify(userData), {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        })
            .then(response => {
                if (response.data.success) {
                    alert('회원가입 성공!');
                    window.location.href = '/';
                } else {
                    alert('회원가입 실패: ' + response.data.message);
                }
            })
            .catch(error => {
                console.error('회원가입 에러:', error);
                if (error.response) {
                    // 서버에서 응답한 오류 메시지 표시
                    alert('회원가입 과정에서 에러가 발생했습니다: ' + error.response.data.message);
                } else {
                    // 네트워크 오류나 기타 예측하지 못한 오류 처리
                    alert('회원가입 과정에서 예측하지 못한 에러가 발생했습니다.');
                }
            });

    });
});
