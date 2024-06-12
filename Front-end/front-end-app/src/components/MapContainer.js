import React, { useEffect, useRef } from 'react';
import useUserLocation from '../hooks/useUserLocation';

function MapContainer({ shelters }) {
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

        // 현재 위치가 유효한 경우 빨간색 마커 생성
        if (location.latitude && location.longitude && !error) {
          const currentPosition = new window.kakao.maps.LatLng(location.latitude, location.longitude);
          const currentMarker = new window.kakao.maps.Marker({
            position: currentPosition,
            map: map,
            image: new window.kakao.maps.MarkerImage(
              'https://e7.pngegg.com/pngimages/236/41/png-clipart-illustration-of-map-icon-google-map-maker-google-maps-computer-icons-map-marker-text-heart-thumbnail.png',
              new window.kakao.maps.Size(32, 32), 
              { offset: new window.kakao.maps.Point(16, 32) }
            )
          });
          map.setCenter(currentPosition);
        }

        // 대피소 위치에 파란색 마커 생성
        shelters.forEach(shelter => {
          if (shelter.location && shelter.location.coordinates) {
            const shelterPosition = new window.kakao.maps.LatLng(shelter.location.coordinates[1], shelter.location.coordinates[0]);
            new window.kakao.maps.Marker({
              position: shelterPosition,
              map: map,
              image: new window.kakao.maps.MarkerImage(
                'https://i.namu.wiki/i/41fR4lzF612B6bqd0VnWjG8eUYNer53WWfkzxaUPhrb2_oiTqyFqvGSQlIk6XH-Tur7EqMteQC3vPFo8LuN_6Q.svg',
                new window.kakao.maps.Size(32, 32), 
                { offset: new window.kakao.maps.Point(16, 32) }
              )
            });
          }
        });
      }
    };

    loadKakaoMap();
  }, [location, error, shelters]); // location이 변경될 때마다 지도 업데이트

  return <div ref={mapRef} style={{ width: '100%', height: '600px' }}></div>;
}

export default MapContainer;
