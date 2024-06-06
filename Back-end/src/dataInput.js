const fs = require('fs');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'Project';
const collectionName = 'shelter';
const csvFilePath = './src/data/shelters.csv';

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log('Connected successfully to MongoDB');
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const shelters = [];
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => {
                // 위도와 경도를 기반으로 location 필드를 GeoJSON 형식으로 생성
                const location = {
                    type: "Point",
                    coordinates: [parseFloat(data['경도(EPSG4326)']), parseFloat(data['위도(EPSG4326)'])] // 주의: GeoJSON은 [경도, 위도] 순서입니다.
                };
                // 원래 데이터에 location 필드 추가
                shelters.push({ ...data, location });
            })
            .on('end', async () => {
                // 읽은 데이터를 MongoDB에 삽입
                await collection.insertMany(shelters);
                console.log('CSV file has been successfully imported into MongoDB with GeoJSON location');
                await client.close();
            });
    } catch (err) {
        console.error('An error occurred:', err);
        await client.close();
    }
}

main().catch(console.error);
