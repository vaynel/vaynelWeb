document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.querySelector('.signup-form');
    const signupButton = document.querySelector('#bt_signup');
    const profilePicInput = document.querySelector('#profile_pic');
    const profilePreview = document.querySelector('#profile-preview');

    // 프로필 정보 요소들
    const nameInput = document.querySelector('#name');
    const birthdayInput = document.querySelector('#birthday');
    const zodiacInput = document.querySelector('#zodiac');
    const mbtiInput = document.querySelector('#mbti');
    const phoneInput = document.querySelector('#phone');

    const diaryName = document.querySelector('#diary-name');
    const diaryBirthday = document.querySelector('#diary-birthday');
    const diaryZodiac = document.querySelector('#diary-zodiac');
    const diaryMbti = document.querySelector('#diary-mbti');
    const diaryPhone = document.querySelector('#diary-phone');

    // 이미지 미리보기 설정
    profilePicInput.addEventListener('change', function () {
        const file = profilePicInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // 입력 필드 업데이트 시 프로필 정보 업데이트
    nameInput.addEventListener('input', function () {
        diaryName.textContent = nameInput.value ? nameInput.value + '의 다이어리' : '떙땡의 다이어리';
    });

    birthdayInput.addEventListener('input', function () {
        diaryBirthday.textContent = birthdayInput.value;
    });

    zodiacInput.addEventListener('change', function () {
        diaryZodiac.textContent = zodiacInput.options[zodiacInput.selectedIndex].text;
    });

    mbtiInput.addEventListener('change', function () {
        diaryMbti.textContent = mbtiInput.options[mbtiInput.selectedIndex].text;
    });

    phoneInput.addEventListener('input', function () {
        let cleaned = phoneInput.value.replace(/\D/g, ''); // 숫자 이외의 문자 제거
        let formatted = '';

        if (cleaned.length > 3) {
            formatted += cleaned.slice(0, 3) + '-';
            if (cleaned.length > 7) {
                formatted += cleaned.slice(3, 7) + '-' + cleaned.slice(7, 11);
            } else {
                formatted += cleaned.slice(3);
            }
        } else {
            formatted = cleaned;
        }

        phoneInput.value = formatted;
        diaryPhone.textContent = formatted;
    });

    signupButton.addEventListener('click', function (event) {
        event.preventDefault();

        const formData = new FormData(signupForm);

        axios.post('/signup', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': formData.get('_csrf')
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
