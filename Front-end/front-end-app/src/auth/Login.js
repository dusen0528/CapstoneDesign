import React, { useState, useEffect } from "react";
import axios from 'axios';
import queryString from 'query-string';

const Login = () => {
    const [user, setUser] = useState(null); // 사용자 정보를 저장할 상태

    useEffect(() => {
        const { code } = queryString.parse(window.location.search);
        if (code) {
            sendCodeToServer(code);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const sendCodeToServer = async (code) => {
        try {
            const response = await axios.post(`http://localhost:3000/api/auth/kakao/login`, { code });
            localStorage.setItem("token", response.data.jwt);
            setUser(response.data.user); // 서버로부터 받은 사용자 정보를 상태에 저장
            alert("로그인에 성공하였습니다!");  // 성공 알림
        } catch (e) {
            console.error("로그인 처리 중 오류가 발생했습니다.", e);
            alert("로그인에 실패하였습니다.");
        }
    };

    const handleLogin = () => {
        const clientId = process.env.REACT_APP_KAKAO_REST_API_KEY;
        const redirectUri = encodeURIComponent(process.env.REACT_APP_KAKAO_REDIRECT_URI);
        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
        window.location.href = kakaoAuthUrl;
    };

    return (
        <div>
            {user ? (
                <div>안녕하세요, {user.nickname}님</div> // 사용자 이름 표시
            ) : (
                <button onClick={handleLogin} style={{border: "none", background: "none"}}>
                    <img src="/images/kakao_login.png" alt="카카오 로그인" width="250px" />
                </button>
            )}
        </div>
    );
};

export default Login;
