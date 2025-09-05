import Jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (res: Response, user: any) => {
  try {
    const token = Jwt.sign({ userId: user._id }, process.env.SECRET_KEY!, { expiresIn: '1d' });
    res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 24*60*60*1000 });
    return token;
  } catch (err) {
    console.error("JWT Error:", err);
    return null;
  }
};
