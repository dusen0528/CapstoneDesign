const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./connectDB");

const app = express();
// require("dotenv").config(); // 맥 환경 변수
require("dotenv").config({ path: "../.env" }); // 윈도우

connectDB();

app.use(cors());
app.use(express.json());

const smsRouter = require("./api/shelters/sms"); // 경로가 정확한지 확인
app.use("/sms", smsRouter);

// 카카오 로그인 라우트 연결
const kakaoAuthRouter = require("./api/auth/kakao");
app.use("/api/auth/kakao", kakaoAuthRouter);

// 대피소 라우트 연결
const sheltersRouter = require("./api/shelters/shelters");
app.use("/api/shelters", sheltersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
