import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const { kakao } = window;

const MapModal = ({ show, handleClose, modalUrl, loading, handleLoaded }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (show && modalUrl) {
      const mapContainer = document.getElementById('modal-map');
      const mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      };
      const newMap = new kakao.maps.Map(mapContainer, mapOption);
      setMap(newMap);

      const urlParams = new URLSearchParams(modalUrl.split('?')[1]);
      const sX = urlParams.get('sX');
      const sY = urlParams.get('sY');
      const eX = urlParams.get('eX');
      const eY = urlParams.get('eY');

      const startPosition = new kakao.maps.LatLng(sY, sX);
      const endPosition = new kakao.maps.LatLng(eY, eX);

      const startMarkerImage = new kakao.maps.MarkerImage(
        'https://e7.pngegg.com/pngimages/236/41/png-clipart-illustration-of-map-icon-google-map-maker-google-maps-computer-icons-map-marker-text-heart-thumbnail.png',
        new kakao.maps.Size(32, 32),
        { offset: new kakao.maps.Point(16, 32) }
      );
      const endMarkerImage = new kakao.maps.MarkerImage(
        'https://i.namu.wiki/i/41fR4lzF612B6bqd0VnWjG8eUYNer53WWfkzxaUPhrb2_oiTqyFqvGSQlIk6XH-Tur7EqMteQC3vPFo8LuN_6Q.svg',
        new kakao.maps.Size(32, 32),
        { offset: new kakao.maps.Point(16, 32) }
      );

      const startMarker = new kakao.maps.Marker({
        position: startPosition,
        image: startMarkerImage
      });
      const endMarker = new kakao.maps.Marker({
        position: endPosition,
        image: endMarkerImage
      });

      startMarker.setMap(newMap);
      endMarker.setMap(newMap);

      // 경로 데이터 가져오기
      fetchRouteData(sX, sY, eX, eY, newMap);

      newMap.setCenter(startPosition);
      newMap.panTo(endPosition);
      handleLoaded();
    }
  }, [show, modalUrl, handleLoaded]);

  const fetchRouteData = async (sX, sY, eX, eY, map) => {
    const url = `https://apis-navi.kakaomobility.com/v1/directions?origin=${sX},${sY}&destination=${eX},${eY}&priority=RECOMMEND&car_fuel=GASOLINE&car_hipass=false&alternatives=false&road_details=false`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      const data = response.data;
      if (data.routes.length > 0 && data.routes[0].sections.length > 0) {
        const sections = data.routes[0].sections[0];
        const linePath = [];

        sections.roads.forEach(road => {
          road.vertexes.forEach((vertex, index) => {
            if (index % 2 === 0) {
              linePath.push(new kakao.maps.LatLng(road.vertexes[index + 1], road.vertexes[index]));
            }
          });
        });

        const polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 5,
          strokeColor: '#000000',
          strokeOpacity: 0.7,
          strokeStyle: 'solid'
        });

        polyline.setMap(map);
      }
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} dialogClassName="custom-modal-size">
      <Modal.Header closeButton>
        <Modal.Title>카카오맵 길찾기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden"></span>
            </Spinner>
          </div>
        ) : (
          <div id="modal-map" style={{ width: '100%', height: '700px' }}></div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>닫기</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MapModal;
