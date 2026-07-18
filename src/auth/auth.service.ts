import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(user: any) {
    const payload = { 
      sub: user.id, 
      username: user.username,       
      email: user.email 
    };
    
    const secret = this.configService.get<string>('JWT_SECRET');

    console.log(secret);

    const accessToken = this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: '100d'
    });
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: '15m'
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const newPayload = { username: payload.username, sub: payload.sub };
      
      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}