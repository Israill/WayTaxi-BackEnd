const User = require('../models/User.model');
const userService = require('../service/user.service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api.error');
const UserDto = require('../dtos/user.dto');

class userController  {
  async registatration (req, res, next) {
    try {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }
      const { email, password, role, phone, name, surname, driversLicense, wallet} = req.body;
      const userData = await userService.registration(email, password, role, phone, name, surname, driversLicense, wallet);
      const candidate = await User.findOne({email})
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login (req, res, next) {
    try {
      const {email, password} =req.body;
      const candidate = await User.findOne({email})
      const userData = await userService.login(email, password);

      if(candidate.isActivated === false) {
        return res.status(400).json("Почта не подтверждена")
      } else {
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData);
      }
    } catch (e) {
      next(e);
    }
  }

  async logout (req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token)
    } catch (e) {
      next(e);
    }
  }

  async activate (req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e);
    }
  }

  async refresh (req, res, next) {
    try {
      const {refreshToken} = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUser (req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users)
    } catch (e) {
      next(e);
    }
  }

  async patchUser (req, res, next) {
    try {
      const { id } = req.params;
      const { role, phone, name, surname, driversLicense, wallet } = req.body;
      
      const users = await User.findByIdAndUpdate(id , { 
        role, 
        phone, 
        name, 
        surname, 
        driversLicense, 
        wallet 
      })
      return res.json(users)
    } catch (e) {
      next(e)
    }
  }

}

module.exports = new userController();