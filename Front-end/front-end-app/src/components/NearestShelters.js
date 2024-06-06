import React, { useState, useEffect } from 'react';
import useUserLocation from '../hooks/useUserLocation';

const NearestShelters = () => {
    const { location, error } = useUserLocation();
    const [shelters, setShelters] = useState([]);

    useEffect(() => {
        // 위치 정보와 백엔드 API 호출 URL 로깅
        console.log('Current location:', location);
        
        // location 객체에 district 정보가 포함되어 있을 때만 요청을 보냅니다.
        if (location.latitude && location.longitude && location.district) {
            const url = `http://localhost:3000/api/shelters/nearest?latitude=${location.latitude}&longitude=${location.longitude}&district=${location.district}`;
            console.log('Fetching nearest shelters with URL:', url); // 요청 URL 로깅
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log('Received shelters data:', data); // 받은 데이터 로깅
                    setShelters(data);
                })
                .catch(fetchError => console.error('Error fetching nearest shelters:', fetchError)); // 오류 로깅
        }
    }, [location]);

    if (error) {
        console.error('Location error:', error); // 위치 정보 에러 로깅
        return <div>Error: {error}</div>;
    }
    if (!location.latitude || !location.longitude) return <div>Loading location...</div>;

    return (
        <div>
            <h2>Nearest Shelters</h2>
            {shelters.length > 0 ? (
                <ul>
                    {shelters.map(shelter => (
                        <li key={shelter._id}>{shelter.name} - {shelter.distance} meters away</li>
                    ))}
                </ul>
            ) : (
                <p>No shelters found.</p>
            )}
        </div>
    );
};

export default NearestShelters;
