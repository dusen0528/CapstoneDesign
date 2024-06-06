const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();

// MongoDB 연결 정보
const uri = 'mongodb://localhost:27017';
const dbName = 'Project';
const collectionName = 'shelter';

// 사용자 위치 기반 가까운 대피소 찾기 엔드포인트
router.get('/nearest', async (req, res) => {
    const { latitude, longitude, district } = req.query; // 사용자 위치와 자치구
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // 해당 자치구에 속하면서 위치가 가까운 대피소 3곳 찾기
        const nearestShelters = await collection.find({
            '자치구': district,
            'location': {
                $near: {
                    $geometry: { type: "Point", coordinates: [ parseFloat(longitude), parseFloat(latitude) ] },
                    $maxDistance: 5000 // 검색 범위 설정(예: 5km)
                }
            }
        }).limit(3).toArray();

        res.json(nearestShelters);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching nearest shelters.");
    } finally {
        await client.close();
    }
});

module.exports = router;
