import { User } from "../models/user";
import { generateToken } from "../services/jwtToken-service";
import { compare, hash } from "../services/passwordHash-service";
import { NextFunction, Request, Response } from "express";
import { BadRequestError, NotFoundError } from "@bshfakelook/common";
import { randomBytes } from "crypto";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { sendMail } from "../utils/email/sendEmail";
import { LoginResponseDto } from "../dtos/login-response.dto";

const clientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientId);

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, username } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email is already in use.");
    }
    const hashedPassword = await hash(password);

    const user = new User({
      email: email,
      password: hashedPassword,
      username: username,
    });
    await user.save();

    res.status(201).json({ userId: user.id });
  } catch (error: any) {
    next(error);
  }
};
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new BadRequestError("Invalid credentials.");
    }
    const passwordMatch = await compare(password, user.password!);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials.");
    }
    const loginResponse = generateToken(
      user.email,
      user.id,
      user.username
    ) as LoginResponseDto;
    res.status(200).json(loginResponse);
  } catch (error: any) {
    next(error);
  }
};

export const googleSigning = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: clientId,
  });
  if (ticket.getPayload()) {
    const email = ticket.getPayload()?.email;
    const name = ticket.getPayload()?.name;
    const username = email
      ? email.split("@")[0] + Math.round(Math.random() * 1000)
      : "";

    let user = await User.findOne({ email });

    try {
      if (!user) {
        user = new User({
          email: email,
          username: username,
        });

        const url =  process.env.IDENTITY_SERVICE;
        await axios.post(
          url! + "/identity/createUserGoogle",
          { name, email, id: user.id, username },
          {
            withCredentials: true,
          }
        );
        await user.save();
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
    const loginResponse = generateToken(
      email!,
      user?.id,
      username
    ) as LoginResponseDto;
    res.status(200).json(loginResponse);
  }
};

export const requestPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new NotFoundError();
    }
    const resetToken = randomBytes(32).toString("hex");
    const hashedResetToken = await hash(resetToken);
    user.resetToken = hashedResetToken;
    user.resetTokenExp = new Date(Date.now() + 3600000);
    await user.save();
    
    const link = `${process.env.PASSWORD_RESET_URL}/passwordReset?token=${resetToken}&id=${user._id}`;
    await sendMail(
      user.email,
      "Reset password.",
      `<p>You requested a password reset</p>
       <p>Click this <a href=${link}>${link}</a> to set a new password.</p>`
    );
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { resetToken, newPassword, userId } = req.body;
    const existUser = await User.findOne({
      _id: userId,
      resetTokenExp: { $gt: Date.now() },
    });
    if (!existUser?.resetToken) {
      throw new BadRequestError("Invalid or expired password reset token.");
    }
    const isValid = await compare(resetToken, existUser.resetToken);
    if (!isValid) {
      throw new BadRequestError("Invalid or expired password reset token.");
    }
    const hashedNewPassword = await hash(newPassword);
    existUser.password = hashedNewPassword;
    existUser.resetToken = undefined;
    existUser.resetTokenExp = undefined;
    existUser.save();
    sendMail(
      existUser.email,
      "Reset password successfully.",
      `<p>your password updated successfully.</p>`
    );
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
