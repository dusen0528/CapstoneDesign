// import { useState, useEffect } from 'react';

// const useUserLocation = () => {
//     const [location, setLocation] = useState({
//       latitude: 35.106609, // 부산 중구의 위도
//       longitude: 129.022176, // 부산 중구의 경도
//       district: "중구" // 하드코딩된 자치구 정보
//     });
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         if (!navigator.geolocation) {
//             setError("Geolocation is not supported by your browser");
//             return;
//         }

//         const onSuccess = (position) => {
//             const { latitude, longitude } = position.coords;
//             setLocation({
//                 latitude,
//                 longitude,
//                 district: "중구" // 하드코딩된 자치구 정보 또는 실제 API를 사용하여 얻은 정보
//             });
//         };

//         const onError = (err) => {
//             setError(err.message);
//         };

//         navigator.geolocation.getCurrentPosition(onSuccess, onError);
//     }, []);

//     return { location, error };
// };

// export default useUserLocation;


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