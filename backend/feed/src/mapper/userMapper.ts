export const toUserDto = (user: any) => {
  return {
    name: user.name,
    username: user.username,
    email: user.email,
    workplace: user.workplace,
    dateOfBirth: user.dateOfBirth,
    address: user.address,
  };
};
