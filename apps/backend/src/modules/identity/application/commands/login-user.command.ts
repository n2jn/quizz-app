/**
 * Login User Command
 *
 * Command for user authentication.
 */
export class LoginUserCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
