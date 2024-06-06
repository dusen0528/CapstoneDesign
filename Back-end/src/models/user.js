const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  kakaoId: { type: String, required: true, unique: true },
  nickname: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
