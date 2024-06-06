import React, {useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import MapContainer from './MapContainer';
import MapModal from './MapModal';
import useModal from '../hooks/useModal';
import useUserLocation from '../hooks/useUserLocation';
import '../styles/main.css';

function MainSection() {
    const {
        show,
        modalUrl,
        loading,
        handleClose,
        handleShow,
        handleLoaded
    } = useModal(); // handleLoaded 추가
    const [shelters, setShelters] = useState([]); // 대피소 정보를 상태로 관리
    const {location, error} = useUserLocation();

    useEffect(() => {
        if (location.latitude && location.longitude && location.district) {
            const url = `http://localhost:3000/api/shelters/nearest?latitude=${location.latitude}&longitude=${location.longitude}&district=${location.district}`;
            console.log('Requesting URL:', url); // 요청 URL 로그 출력
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log('Received data:', data); // 응답 데이터 로그 출력
                    setShelters(data);
                    handleLoaded();
                })
                .catch(error => {
                    console.error('Error fetching nearest shelters:', error);
                })
                . finally(() => {
                    handleLoaded(); // API 호출이 끝나고 나서 로딩 상태 해제
                });
        }
    }, [location, handleLoaded]); // 의존성 배열에 handleLoaded를 추가

    if (error) {
        // 위치 정보 오류를 처리하거나 사용자에게 표시하는 로직 추가
        console.error("Location error:", error);
    }

    // 대피소로 안내하는 버튼을 눌렀을 때의 처리 로직
    const handleRouteClick = (shelter) => {
        if (location.latitude && location.longitude) {
            // 출발지의 경도와 위도 (useUserLocation 훅에서 제공하는 값)
            const startLatitude = location.latitude; // 위도
            const startLongitude = location.longitude; // 경도
            // 목적지의 경도와 위도 추출
            const endLatitude = shelter
                .location
                .coordinates[1];
            const endLongitude = shelter
                .location
                .coordinates[0];

            // 출발지와 목적지 좌표를 로그로 출력
            console.log('Start Coordinates:', startLatitude, startLongitude);
            console.log('End Coordinates:', endLatitude, endLongitude);

            const url = `https://map.kakao.com/?sX=${startLongitude}&sY=${startLatitude}&eX=${endLongitude}&eY=${endLatitude}&eName=${encodeURIComponent(
                shelter.도로명전체주소 || shelter.소재지전체주소
            )}`;
            console.log('test', url);
            handleLoaded(); // 모달 로딩 상태 해제
            handleShow(url); // 모달에 URL 전달
        } else {
            console.error("현재 위치 정보를 가져올 수 없습니다.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8">
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>KaKaoMaps</Card.Title>
                            <MapContainer/>
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-4">
                    <div className="button-area">
                        {
                            shelters.map((shelter, index) => (
                                <Button
                                    key={index}
                                    variant="primary"
                                    className="mb-2 btn-circle"
                                    onClick={() => handleRouteClick(shelter)}>
                                    대피소 {index + 1}
                                </Button>
                            ))
                        }
                    </div>
                </div>
            </div>
            <MapModal show={show} handleClose={handleClose} modalUrl={modalUrl} loading={loading} handleLoaded={handleLoaded}
                // handleLoaded 함수를 props로 전달
            />
        </div>
    );
}

export default MainSection;