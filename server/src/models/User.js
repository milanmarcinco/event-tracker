const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { jwtSign, jwtVerify } = require("../helpers/jwt");

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      maxLength: [20, "First name is too long"],
      validate: {
        validator: (v) => validator.isAlpha(v),
        message: "First name contains forbidden characters",
      },
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      maxLength: [20, "Last name is too long"],
      validate: {
        validator: (v) => validator.isAlpha(v),
        message: "Last name contains forbidden characters",
      },
      trim: true,
    },

    nickname: {
      type: String,
      required: [true, "Nickname is required"],
      maxLength: [20, "Nickname is too long"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Invalid email address",
      },
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    refreshTokens: {
      type: [String],
    },
  },
  { timestamps: true }
);

// Create user object for frontend
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.refreshTokens;
  delete userObj.__v;
  delete userObj.updatedAt;

  return userObj;
};

// Check if password is correct
UserSchema.methods.checkPassword = async function (password) {
  const user = this;
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (passwordIsCorrect) return true;
  else return false;
};

// Generate token for a user
UserSchema.methods.genToken = async function (type, options) {
  const user = this;
  const userObj = {
    _id: user._id,
  };
  const token = jwtSign(userObj, type, options);
  return token;
};

// Hash user's password before saving
UserSchema.pre("save", async function (next) {
  try {
    const user = this;

    if (user.isModified("password")) {
      if (user.password.length < 8) {
        throw new Error("Password is too short");
      }

      if (user.password.length > 250) {
        throw new Error("Password is too long");
      }

      user.password = await bcrypt.hash(user.password, 8);
    }

    next();
  } catch (err) {
    throw new Error(err.message);
  }
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
