import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import useUserLocation from '../hooks/useUserLocation';

const { kakao } = window;

const Map = ({ shelters, onRouteClick }) => {
  const [map, setMap] = useState(null);
  const { location } = useUserLocation();

  useEffect(() => {
    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3
    };
    const newMap = new kakao.maps.Map(mapContainer, mapOption);
    setMap(newMap);
  }, []);

  const setPoint = ({ lat, lng }, pointType) => {
    let marker = new kakao.maps.Marker({ position: new kakao.maps.LatLng(lat, lng) });
    marker.setMap(map);
  };

  useEffect(() => {
    if (location.latitude && location.longitude) {
      setPoint({ lat: location.latitude, lng: location.longitude }, 'startPoint');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      <div id="map" style={{ width: "450px", height: "450px" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
        {shelters.map((shelter, index) => (
          <Button key={index} variant="primary" onClick={() => onRouteClick(shelter)}>
            대피소 {index + 1}
          </Button>
        ))}
      </div>
    </>
  );
};

export default Map;
