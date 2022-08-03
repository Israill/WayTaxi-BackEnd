const jwt = require('jsonwebtoken');
const Token = require('../models/Token.model');

class tokenService  {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '24h'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '7d'});
    return { 
      accessToken,
      refreshToken,
    }
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await Token.findOne( {user: userId} )
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save()
    }
    const token = await Token.create({user: userId, refreshToken})
    return token
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.deleteOne( {refreshToken})
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await Token.findOne( {refreshToken})
    return tokenData;
  }
}
module.exports = new tokenService()