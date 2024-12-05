import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Facebook } from 'fb';
import { AllConfigType } from 'src/config/config.type';
import { SocialInterface } from 'src/social/interfaces/social.interface';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dot';
import { FacebookInterface } from './interfaces/facebook.interface';

@Injectable()
export class AuthFacebookService {
  constructor(private readonly configService: ConfigService<AllConfigType>) {}

  async getProfileByToken(
    loginDto: AuthFacebookLoginDto,
  ): Promise<SocialInterface> {
    const fb: Facebook = new Facebook({
      appId: this.configService.get<string>('facebook.appId', {
        infer: true,
      }),
      appSecret: this.configService.get<string>('facebook.appSecret', {
        infer: true,
      }),
      version: 'v7.0',
    });
    fb.setAccessToken(loginDto.accessToken);

    const data: FacebookInterface = await new Promise((resolve) => {
      fb.api(
        '/me',
        'get',
        { fields: 'id,last_name,email,first_name' },
        (response) => {
          resolve(response);
        },
      );
    });

    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
    };
  }
}
