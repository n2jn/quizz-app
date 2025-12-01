import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../services/jwt.service';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';

/**
 * JWT Strategy
 *
 * Validates JWT tokens and attaches user to request.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      userId: user.id,
      email: user.getEmail().value,
      username: user.getUsername().value,
      role: user.getRole(),
    };
  }
}
