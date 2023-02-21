export class LoginResponseDto {
  constructor(private userId: string, private token: string, private expiresIn: string) {}
}
