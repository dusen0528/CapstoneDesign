const express = require('express');
const axios = require('axios');
const https = require('https');
const router = express.Router();

// 서비스 키 값을 설정합니다.
const serviceKey = '8G6YTUW77U2165H6';
const apiUrl = 'https://www.safetydata.go.kr/V2/api/DSSP-IF-00247';

// HTTPS 에이전트 설정 (SSL 검증 무시)
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

router.get('/', async (req, res) => {
    try {
        console.log('API 호출 시작');
        console.log('요청 URL:', apiUrl);
        console.log('요청 매개변수:', {
            serviceKey: serviceKey,
            numOfRows: 10,
            pageNo: 1
        });

        const response = await axios.get(apiUrl, {
            httpsAgent,
            params: {
                serviceKey: serviceKey,
                numOfRows: 10,
                pageNo: 1
            }
        });

        console.log('API 응답 데이터:', response.data);
        res.json(response.data);
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error.response ? error.response.data : error.message);
        res.status(500).send('서버 오류');
    }
});


module.exports = router;
