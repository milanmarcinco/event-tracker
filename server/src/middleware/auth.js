const { jwtVerify } = require("../helpers/jwt");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    //TODO: verify authorization header is set before parsing the token
    const authToken = req.get("Authorization").split(" ")[1] || "";

    const payload = jwtVerify(authToken, "access", { ignoreExpiration: false });

    if (!payload) {
      throw { message: "User not authenticated", statusCode: 401 };
    }

    const user = await User.findById(payload._id).exec();
    if (!user) throw { message: "User does not exist", statusCode: 401 };

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
