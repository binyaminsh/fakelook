import jwt from "jsonwebtoken";
import { LoginResponseDto } from "../dtos/login-response.dto";
export const generateToken = (email: string, id: string, username: string) => {
  const TOKEN_SECRET = process.env.TOKEN_SECRET;

  const expiresIn = "900";
  const token = jwt.sign(
    {
      email,
      id,
      username
    },
    TOKEN_SECRET!,
    { expiresIn: "15m" }
  );
  const loginResponse = new LoginResponseDto(id, token, expiresIn);
  return loginResponse;
};
