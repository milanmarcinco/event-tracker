const { jwtVerify } = require("../helpers/jwt");
const User = require("../models/User");
const Event = require("../models/Event");

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, nickname, email, password } = req.body.user;

    const match = await User.findOne({ email }).exec();
    if (match) throw { message: "User already exists", statusCode: 409 };

    const newUser = new User({ firstName, lastName, nickname, email, password });

    const accessToken = await newUser.genToken("access", { expiresIn: "30m" });
    const refreshToken = await newUser.genToken("refresh", { expiresIn: "30d" });

    if (!accessToken || !refreshToken)
      throw {
        message: "An error occurred while trying to log in the newly registered user",
        statusCode: 500,
      };

    newUser.refreshTokens.push(refreshToken);

    await newUser.save();

    res.status(201).json({
      error: null,
      user: newUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body.user;
    if (!email || typeof email !== "string") throw { message: "Please provide a valid email address", statusCode: 400 };
    if (!password || typeof password !== "string")
      throw { message: "Please provide a valid password", statusCode: 400 };

    const foundUser = await User.findOne({ email }, "+password").exec();
    if (!foundUser) throw { message: "User not found", statusCode: 404 };

    const passwordIsCorrect = await foundUser.checkPassword(password);
    if (!passwordIsCorrect) throw { message: "Password is incorrect", statusCode: 401 };

    const accessToken = await foundUser.genToken("access", { expiresIn: "30m" });
    const refreshToken = await foundUser.genToken("refresh", { expiresIn: "30d" });
    if (!accessToken || !refreshToken) {
      throw {
        message: "An error occurred while trying to log in",
        statusCode: 500,
      };
    }

    foundUser.refreshTokens.push(refreshToken);

    await foundUser.save();

    res.status(200).json({
      error: null,
      user: foundUser,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.renewToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw { message: "Please provide a valid refresh token", statusCode: 400 };

    const tokenPayload = jwtVerify(refreshToken, "refresh", { ignoreExpiration: false });
    if (!tokenPayload) throw { message: "Invalid refresh token", statusCode: 401 };

    const { _id } = tokenPayload;
    const foundUser = await User.findById(_id).exec();
    if (!foundUser) throw { message: "User does not exist", statusCode: 404 };

    if (!foundUser.refreshTokens.includes(refreshToken)) throw { message: "Invalid refresh token", statusCode: 401 };

    foundUser.refreshTokens = foundUser.refreshTokens.filter((token) => {
      return token !== refreshToken && jwtVerify(token, "refresh", { ignoreExpiration: false });
    });

    const newAccessToken = await foundUser.genToken("access", { expiresIn: "30m" });

    res.status(200).json({
      error: null,
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw { message: "Please provide a valid refresh token", statusCode: 400 };

    const { oldPassword, newPassword } = req.body.user;
    if (!oldPassword || typeof oldPassword !== "string")
      throw { message: "Please provide a valid old password", statusCode: 400 };
    if (!newPassword || typeof newPassword !== "string")
      throw { message: "Please provide a valid new password", statusCode: 400 };

    const tokenPayload = jwtVerify(refreshToken, "refresh", { ignoreExpiration: false });
    if (!tokenPayload) throw { message: "Invalid authentication token", statusCode: 401 };

    const { _id } = tokenPayload;
    const foundUser = await User.findById(_id, "+password").exec();
    if (!foundUser) throw { message: "User does not exist", statusCode: 404 };

    if (!foundUser.refreshTokens.includes(refreshToken)) throw { message: "Invalid refresh token", statusCode: 401 };

    const passwordIsCorrect = await foundUser.checkPassword(oldPassword);
    if (!passwordIsCorrect) throw { message: "Password is incorrect", statusCode: 401 };

    foundUser.password = newPassword;

    foundUser.refreshTokens = [];

    await foundUser.save();

    res.status(200).json({
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { user, refreshToken } = req.body;
    if (!refreshToken) throw { message: "Please provide a valid refresh token", statusCode: 400 };

    const tokenPayload = jwtVerify(refreshToken, "refresh", { ignoreExpiration: false });
    if (!tokenPayload) throw { message: "Invalid authentication token", statusCode: 401 };

    const { _id } = tokenPayload;
    const foundUser = await User.findById(_id).exec();
    if (!foundUser) throw { message: "User does not exist", statusCode: 404 };

    if (!foundUser.refreshTokens.includes(refreshToken)) throw { message: "Invalid refresh token", statusCode: 401 };

    foundUser.firstName = user.firstName;
    foundUser.lastName = user.lastName;
    foundUser.nickname = user.nickname;

    await foundUser.save();

    res.status(200).json({
      error: null,
      user: foundUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.logOut = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw { message: "Please provide a valid refresh token", statusCode: 400 };

    const tokenPayload = jwtVerify(refreshToken, "refresh", { ignoreExpiration: true });
    if (!tokenPayload) throw { message: "Invalid authentication token", statusCode: 401 };

    const { _id } = tokenPayload;
    const foundUser = await User.findById(_id).exec();
    if (!foundUser) throw { message: "User does not exists", statusCode: 404 };

    if (foundUser.refreshTokens.length === 0)
      throw { message: "User is already logged out from all devices", statusCode: 400 };

    if (!foundUser.refreshTokens.includes(refreshToken))
      throw { message: "User was already logged out", statusCode: 404 };

    foundUser.refreshTokens = foundUser.refreshTokens.filter((token) => {
      return token !== refreshToken && jwtVerify(token, "refresh", { ignoreExpiration: false });
    });

    await foundUser.save();

    res.status(200).json({
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.logOutAll = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw { message: "Please provide a valid refresh token", statusCode: 400 };

    const tokenPayload = jwtVerify(refreshToken, "refresh", { ignoreExpiration: true });
    if (!tokenPayload) throw { message: "Invalid refresh token", statusCode: 401 };

    const { _id } = tokenPayload;
    const foundUser = await User.findById(_id).exec();
    if (!foundUser) throw { message: "User does not exist", statusCode: 404 };

    if (!foundUser.refreshTokens.includes(refreshToken)) throw { message: "Invalid refresh token", statusCode: 401 };

    if (foundUser.refreshTokens.length === 0)
      throw { message: "User already logged out from all devices", statusCode: 400 };

    foundUser.refreshTokens = [];

    await foundUser.save();

    res.status(200).json({
      error: null,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProfile = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw { message: "Please provide a valid refresh token", statusCode: 400 };

    const { password } = req.body.user;
    if (!password || typeof password !== "string")
      throw { message: "Please provide a valid password", statusCode: 400 };

    const tokenPayload = jwtVerify(refreshToken, "refresh", { ignoreExpiration: true });
    if (!tokenPayload) throw { message: "Invalid refresh token", statusCode: 401 };

    const { _id } = tokenPayload;
    const foundUser = await User.findById(_id, "+password").exec();
    if (!foundUser) throw { message: "User does not exist", statusCode: 404 };

    if (!foundUser.refreshTokens.includes(refreshToken)) throw { message: "Invalid refresh token", statusCode: 401 };

    const passwordIsCorrect = await foundUser.checkPassword(password);
    if (!passwordIsCorrect) throw { message: "Password is incorrect", statusCode: 401 };

    await foundUser.remove();
    await Event.deleteMany({ owner: foundUser._id });

    res.status(200).json({
      error: null,
    });
  } catch (err) {
    next(err);
  }
};
