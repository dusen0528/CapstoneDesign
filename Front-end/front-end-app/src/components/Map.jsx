import React, { useEffect, useState } from 'react';
import useUserLocation from '../hooks/useUserLocation';

const { kakao } = window;

const Map = ({ shelters, width = "100%", height = "100%" }) => {
  const [map, setMap] = useState(null);
  const { location } = useUserLocation();

  useEffect(() => {
    if (location.latitude && location.longitude) {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new kakao.maps.LatLng(location.latitude, location.longitude),
        level: 3
      };
      const newMap = new kakao.maps.Map(mapContainer, mapOption);
      setMap(newMap);
    }
  }, [location]);

  const setPoint = ({ lat, lng }, markerImage = null) => {
    const markerPosition = new kakao.maps.LatLng(lat, lng);
    const markerOptions = markerImage ? { position: markerPosition, image: markerImage } : { position: markerPosition };
    const marker = new kakao.maps.Marker(markerOptions);
    marker.setMap(map);
  };

  useEffect(() => {
    if (location.latitude && location.longitude) {
      const currentMarkerImage = new kakao.maps.MarkerImage(
        'https://e7.pngegg.com/pngimages/236/41/png-clipart-illustration-of-map-icon-google-map-maker-google-maps-computer-icons-map-marker-text-heart-thumbnail.png',
        new kakao.maps.Size(32, 32),
        { offset: new kakao.maps.Point(16, 32) }
      );
      setPoint({ lat: location.latitude, lng: location.longitude }, currentMarkerImage);
    }
  }, [location, map]);

  useEffect(() => {
    if (map && shelters.length) {
      const imageSrc = 'https://i.namu.wiki/i/41fR4lzF612B6bqd0VnWjG8eUYNer53WWfkzxaUPhrb2_oiTqyFqvGSQlIk6XH-Tur7EqMteQC3vPFo8LuN_6Q.svg';
      const imageSize = new kakao.maps.Size(32, 32); // 마커 이미지 크기 설정
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      shelters.forEach(shelter => {
        const [lng, lat] = shelter.location.coordinates;
        setPoint({ lat, lng }, markerImage);
      });
    }
  }, [map, shelters]);

  return (
    <div id="map" style={{ width: width, height: height }} />
  );
};

export default Map;
