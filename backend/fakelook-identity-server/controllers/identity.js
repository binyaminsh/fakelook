const User = require("../models/user");
const { validationResult } = require("express-validator");
const axios = require("axios");
const { publishMessage } = require("../services/publisher-service");

const {
  RequestValidationError,
  BadRequestError,
  NotFoundError,
} = require("@bshfakelook/common");

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.currentUser.id });

    if (!user) {
      throw new NotFoundError("user not found");
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const requestData = { ...req.body };
    const filter = { _id: req.currentUser.id };
    const update = { ...requestData };
    const userInDb = await User.findOneAndUpdate(filter, update, { new: true });
    if (!userInDb) {
      throw new NotFoundError("user not found");
    }

    await publishMessage("user_updated", { update, filter });
    res.status(200).json(userInDb);
  } catch (error) {
    next(error);
  }
};

exports.createUserGoogle = async (req, res, next) => {
  try {
    const { email, name, id, username } = req.body;

    const user = new User({
      email,
      name,
      id,
      username,
    });
    await user.save();
    await publishMessage("user_created", user);
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const userDetails = { ...req.body };

    const url = `${process.env.AUTH_SERVICE_URL}/auth/signup`;
    const payload = {
      email: userDetails.email,
      password: userDetails.password,
      username: userDetails.username,
    };
    const response = await axios.post(url, payload);

    const { userId } = response.data;

    // TODO: Calculate age with date-fns differenceInYears method before saving to db
    const user = new User({
      ...userDetails,
      id: userId,
    });

    user
      .save()
      .then(() => publishMessage("user_created", user))
      .then(() => res.status(201).json({ userId }))
      .catch((err) => {
        throw new BadRequestError(err.message);
      });
  } catch (error) {
    const err = new BadRequestError(error.message);
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  let users = await User.find().exec();

  users = users.map((user) => {
    return {
      name: user.name,
      username: user.username,
    };
  });

  res.status(200).json(users);
};
