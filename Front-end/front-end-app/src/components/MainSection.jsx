import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Map from './Map'; // MapContainer 대신 Map을 사용합니다.
import MapModal from './MapModal';
import useModal from '../hooks/useModal';
import useUserLocation from '../hooks/useUserLocation';
import Sms from './Sms';
import '../styles/main.css';

function MainSection() {
    const { show, modalUrl, loading, handleClose, handleShow, handleLoaded } = useModal();
    const [shelters, setShelters] = useState([]);
    const { location, error } = useUserLocation();

    useEffect(() => {
        if (location.latitude && location.longitude && location.district) {
            const url = `http://localhost:3000/api/shelters/nearest?latitude=${location.latitude}&longitude=${location.longitude}&district=${location.district}`;
            console.log('Requesting URL:', url);
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log('Received data:', data);
                    setShelters(data);
                    handleLoaded();
                })
                .catch(error => {
                    console.error('Error fetching nearest shelters:', error);
                })
                .finally(() => {
                    handleLoaded();
                });
        }
    }, [location, handleLoaded]);

    if (error) {
        console.error("Location error:", error);
    }

    const handleRouteClick = (shelter) => {
        if (location.latitude && location.longitude) {
            const startLatitude = location.latitude;
            const startLongitude = location.longitude;
            const endLatitude = shelter.location.coordinates[1];
            const endLongitude = shelter.location.coordinates[0];

            console.log('Start Coordinates:', startLatitude, startLongitude);
            console.log('End Coordinates:', endLatitude, endLongitude);

            const url = `https://map.kakao.com/?sX=${startLongitude}&sY=${startLatitude}&eX=${endLongitude}&eY=${endLatitude}&eName=${encodeURIComponent(
                shelter.도로명전체주소 || shelter.소재지전체주소
            )}`;
            console.log('test', url);
            handleLoaded();
            handleShow(url);
        } else {
            console.error("현재 위치 정보를 가져올 수 없습니다.");
        }
    };

    return (
        <div className="container mt-5 main-section">
            <div className="row">
                <div className="col-md-8 d-flex flex-column">
                    <Card className="mb-4 flex-grow-1">
                        <Card.Body className="d-flex flex-column">
                            <Card.Title>주변 대피소</Card.Title>
                            <Map shelters={shelters} width="100%" height="770px" /> {/* width와 height를 props로 전달 */}
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-4 d-flex flex-column">
                    <div className="info-section flex-grow-1">
                        <h2>재난 정보 및 대피소</h2>
                        <div className="shelter-info">
                            {shelters.map((shelter, index) => (
                                <div key={index} className="shelter-detail">
                                    <h3>{index + 1}번 대피소</h3>
                                    <p><strong>도로명전체주소:</strong> {shelter['도로명전체주소']}</p>
                                    <p><strong>시설위치:</strong> {shelter['시설위치(지상/지하)']}</p>
                                    <p><strong>시설면적:</strong> {shelter['시설면적(㎡)']}㎡</p>
                                    <p><strong>최대 수용인원:</strong> {shelter['최대수용인원']}명</p>
                                    <button className="btn" onClick={() => handleRouteClick(shelter)}>
                                        길찾기
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Sms /> {/* 재난 정보를 표시하는 컴포넌트를 추가 */}
            <MapModal show={show} handleClose={handleClose} modalUrl={modalUrl} loading={loading} handleLoaded={handleLoaded} />
        </div>
    );
}

export default MainSection;
