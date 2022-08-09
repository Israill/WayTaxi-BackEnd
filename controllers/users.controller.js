const User = require("../models/User.model");
const userService = require("../service/user.service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api.error");
const UserDto = require("../dtos/user.dto");

class userController {
  async registatration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const {
        email,
        password,
        role,
        phone,
        name,
        surname,
        driversLicense,
        wallet,
      } = req.body;
      const userData = await userService.registration(
        email,
        password,
        role,
        phone,
        name,
        surname,
        driversLicense,
        wallet
      );
      const candidate = await User.findOne({ email });
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const candidate = await User.findOne({ email });
      const userData = await userService.login(email, password);

      if (candidate.isActivated === false) {
        return res.status(400).json("Почта не подтверждена");
      } else {
        res.cookie("refreshToken", userData.refreshToken, {
          maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        return res.json(userData);
      }
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async patchUser(req, res, next) {
    try {
      const { id } = req.params;
      const { role, phone, name, surname, driversLicense, wallet, rating, counter } = req.body;

      const users = await User.findByIdAndUpdate(id, {
        role,
        phone,
        name,
        surname,
        driversLicense,
        wallet,
        rating,
        counter
      });
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async topUpWallet(req, res) {
    try {
      const user = await User.findById(req.params.id);
      const sum = user.wallet + req.body.wallet;
      const result = await User.findByIdAndUpdate(req.params.id, {
        wallet: sum,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async patchUserRait(req, res) {
    try {

      const rait = await User.findByIdAndUpdate(req.params.id, {
        $push: {
          rating: req.body.star,
        },
      }, {new: true});

      const reduceRating = rait.rating.reduce((item, acc) => item += acc)
      const averageRating = (reduceRating / rait.rating.length).toFixed(1)

      await User.findByIdAndUpdate(req.params.id, {
        $set: {
          averageRating: averageRating,
        },
      }, {new: true});
      
      return res.json(rait)
    } catch (error) {
      res.json({error: error.message})
    }
  }

  async paymentTaxi(req, res, next) {
    try {
      // const userId = req.user.id;

      const client = await User.findById(req.body.userId);
      // return res.json(client.wallet)

      if (client.wallet <= 0) {
        return res.json(
          "У вас недостачно денежных средств. Пожалуйста пополните баланс."
        ) 
      } else {
        res.json("Оплата прошла успешно")
      }

      const driver = await User.findById(req.params.id);

      const upCash = driver.wallet + req.body.payment;

      const downCash = client.wallet - req.body.payment;

      const downCashClient = await User.findByIdAndUpdate(
        client._id,
        {
          wallet: downCash,
        },
        { new: true }
      );

      const upCashDriver = await User.findByIdAndUpdate(driver._id, {
        wallet: upCash,
      });

      return res.json(driver);
    } catch (error) {
      res.json(error.message);

    }
  }
}
//fdkgmd hkgjhnuulhj
module.exports = new userController();
