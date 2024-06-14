const nodemailer = require('nodemailer');

// SMTP 서버 설정을 함수 밖에서 한 번만 설정
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'kimjeahyun@visionspace.co.kr',  // SMTP 계정 이메일 주소
        pass: 'syqd yxii ujcc ngum'          // SMTP 계정 비밀번호
    }
});

// 이메일 보내기 함수
async function sendMail(to, subject, html) {
    const mailOptions = {
        from: 'kimjeahyun@visionspace.co.kr', // 발신자 이메일 주소
        to, // 수신자 이메일 주소
        subject, // 이메일 제목
        html // 이메일 본문 (HTML 포맷)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.response);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
module.exports = { sendMail };

