const express = require('express');
const axios = require('axios');
const https = require('https');
const router = express.Router();

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

        // 1. 초기 데이터 가져오기
        const initialResponse = await axios.get(apiUrl, {
            httpsAgent,
            params: {
                serviceKey: serviceKey,
                numOfRows: 10,
                pageNo: 1
            }
        });

        const totalCount = initialResponse.data.totalCount; // 전체 데이터 수 추출
        const numOfRows = 10;
        const totalPages = Math.ceil(totalCount / numOfRows); // 전체 페이지 수 계산
        console.log('전체 데이터 수:', totalCount);
        console.log('계산된 전체 페이지 수:', totalPages);

        // 2. 마지막 페이지 데이터 가져오기
        const lastPageResponse = await axios.get(apiUrl, {
            httpsAgent,
            params: {
                serviceKey: serviceKey,
                numOfRows: numOfRows,
                pageNo: totalPages
            }
        });

        console.log('마지막 페이지 데이터:', lastPageResponse.data);

        // 3. 데이터 필터링
        const filteredData = lastPageResponse.data.body.filter(item => 
            item.SN > 205163 && item.RCPTN_RGN_NM.includes("부산")
        );

        // 4. 필요한 정보 추출
        if (filteredData.length === 0) {
            return res.json([{ disasterType: "안전", message: "현재 부산 지역은 안전한 상태입니다" }]);
        }

        const result = filteredData.map(item => ({
            disasterType: item.DST_SE_NM,
            message: item.MSG_CN
        }));

        res.json(result);
    } catch (error) {
        console.error('API 호출 중 오류 발생:', error.response ? error.response.data : error.message);
        res.status(500).send('서버 오류');
    }
});

module.exports = router;
