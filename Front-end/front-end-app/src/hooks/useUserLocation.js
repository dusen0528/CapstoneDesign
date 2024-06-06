// import { useState, useEffect } from 'react';

// const useUserLocation = () => {
//   const [location, setLocation] = useState({ latitude: null, longitude: null, district: null });
//   const [error, setError] = useState(null);

//   const loadScriptAndGetLocation = () => {
//     if (window.kakao && window.kakao.maps) {
//       getLocation();
//     } else {
//       const script = document.createElement('script');
//       script.onload = () => {
//         window.kakao.maps.load(() => {
//           getLocation();
//         });
//       };
//       script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=true`;
//       document.head.appendChild(script);
//     }
//   };

//   const getLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition((position) => {
//         const { latitude, longitude } = position.coords;
//         setLocation({ latitude, longitude });
//         // 위치 기반으로 추가 로직 실행 예: 역지오코딩
//       }, (geoError) => {
//         setError(geoError.message);
//       });
//     } else {
//       setError('Geolocation is not supported by your browser.');
//     }
//   };

//   useEffect(() => {
//     loadScriptAndGetLocation();
//   }, []);

//   return { location, error };
// };

// export default useUserLocation;

// ------ 테스트 코드 아래 --------
import { useState, useEffect } from 'react';

const useUserLocation = () => {
    const [location, setLocation] = useState({
      latitude: 35.106609, // 부산 중구의 위도
      longitude: 129.022176, // 부산 중구의 경도
      district: "중구" // 하드코딩된 자치구 정보
    });
    const [error, setError] = useState(null);
    return { location, error };
};

export default useUserLocation;