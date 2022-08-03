const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail.service');
const tokenService = require('./token.service');
const UserDto = require('../dtos/user.dto');
const ApiError = require('../exceptions/api.error')

class userService  {
  async registration (email, password, role, phone, name, surname, driversLicense, wallet)  {
    const candidate = await User.findOne( {email} )
    if ( candidate) {
      throw ApiError.BadRequest(`Пользователь с таким почтовым адресом уже существует`)
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const activationLink = uuid.v4();
    const user = await User.create({email, password: hashPassword, activationLink, role, phone, name, surname, driversLicense, wallet});
    await mailService.sendActivationMail(email, `${process.env.API_URL}/activate/${activationLink}`);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens( {...userDto} );
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async activate(activationLink) {
    const user = await User.findOne({activationLink})
    if(!user) {
      throw ApiError.BadRequest('Неккоректная ссылка актвации ')
    }
    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await User.findOne({email})
    if(!user) {
      throw ApiError.BadRequest('Пользователь с таким Email не найден')
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if(!isPassEquals) {
      throw ApiError.BadRequest('Неверный пароль')
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token;
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if(!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async getAllUsers() {
    const users = await User.find();
    return users;
  }
}

module.exports = new userService