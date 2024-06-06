const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../../models/user'); // 실제 경로에 맞게 수정하세요.

const router = express.Router();
// 사용된 인증 코드를 저장할 변수
const usedCodes = new Set();

router.post('/login', async (req, res) => {
    const { code } = req.body;

    if (usedCodes.has(code)) {
        return res.status(400).json({ error: '이미 사용된 인증 코드입니다.' });
    }

    try {
        const data = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_CLIENT_ID,
            redirect_uri: process.env.KAKAO_REDIRECT_URI,
            code
        }).toString();

        const tokenResponse = await axios.post('https://kauth.kakao.com/oauth/token', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const accessToken = tokenResponse.data.access_token;
        const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const kakaoId = userInfoResponse.data.id.toString();
        const nickname = userInfoResponse.data.properties?.nickname ?? 'Guest';

        let user = await User.findOne({ kakaoId });
        if (!user) {
            user = new User({ kakaoId, nickname });
            await user.save();
        }

        const jwtToken = jwt.sign({ userId: user._id, kakaoId }, process.env.JWT_SECRET, { expiresIn: '2h' });

        // 인증 코드 사용 처리
        usedCodes.add(code);

        res.json({ jwt: jwtToken, user: { nickname: user.nickname } });
    } catch (error) {
        console.error('Error during Kakao authentication:', error);
        res.status(500).json({ error: 'Internal Server Error', detail: error.message });
    }
});

module.exports = router;
