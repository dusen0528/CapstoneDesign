// 재난 SMS
const express = require('express');
const router = express.Router();
const axios = require('axios');

const url = 'https://www.safetydata.go.kr/openApi/행정안전부_긴급재난문자';
const params = {
    serviceKey: '8G6YTUW77U2165H6',
    returnType: 'json',
    pageNum: '1',
    numRowsPerPage: '5'
};

router.get('/', async (req, res) => {
    try {
        const response = await axios.get(url, { params });
        res.json(response.data);
    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        res.status(500).send('API 요청 중 오류 발생');
    }
});

module.exports = router;
