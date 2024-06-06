import React, { useEffect, useRef } from 'react';
import useUserLocation from '../hooks/useUserLocation';

function MapContainer() {
  const mapRef = useRef(null); // 지도를 표시할 DOM 참조
  const { location, error } = useUserLocation(); // 현재 위치 정보와 오류 메시지 가져오기

  useEffect(() => {
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        // 지도 옵션 설정
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 기본 위치 (서울 시청)
          level: 3,
        };

        // 지도 생성
        const map = new window.kakao.maps.Map(mapRef.current, options);

        // 위치 정보가 유효한 경우
        if (location.latitude && location.longitude && !error) {
          // 현재 위치를 지도의 중심으로 설정
          const currentPosition = new window.kakao.maps.LatLng(location.latitude, location.longitude);
          map.setCenter(currentPosition);

          // 현재 위치에 마커 생성
          new window.kakao.maps.Marker({
            position: currentPosition,
            map: map,
          });
        }
      }
    };

    loadKakaoMap();
  }, [location, error]); // location이 변경될 때마다 지도 업데이트

  return <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>;
}

export default MapContainer;