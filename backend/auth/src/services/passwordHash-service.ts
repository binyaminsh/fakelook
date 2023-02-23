import bcrypt from "bcryptjs";

export const hash = async (password: string) => {
  return bcrypt.hash(password, 8);
};

export const compare = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};
