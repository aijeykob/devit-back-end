const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const db = require('../models');
const config = require('../config/auth.config');
const { users: User, refreshToken: RefreshToken } = db;

const handleError = (res, status, message) => {
  res.status(status).send({ message });
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (!validator.isEmail(email) || !password) {
    return handleError(res, 400, 'Invalid input data');
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return handleError(res, 404, 'Incorrect data!');
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return handleError(res, 404, 'Invalid data!');
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    const refreshToken = await RefreshToken.createToken(user);

    res.status(200).send({
      id: user.id,
      name: user.name,
      email: user.email,
      accessToken: token,
      refreshToken,
    });
  } catch (err) {
    handleError(res, 500, err.message);
  }
};

exports.refreshToken = async (req, res) => {
  const { refresh_token: requestToken } = req.body;

  if (requestToken == null) {
    return handleError(res, 403, 'Refresh Token is required!');
  }

  try {
    const refreshToken = await RefreshToken.findOne({
      where: { token: requestToken },
    });

    if (!refreshToken) {
      return handleError(res, 403, 'Refresh token is not in database!');
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await RefreshToken.destroy({ where: { id: refreshToken.id } });

      return handleError(
        res,
        403,
        'Refresh token was expired. Please make a new signin request'
      );
    }

    const user = await refreshToken.getUser();
    const newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    handleError(res, 500, err);
  }
};
