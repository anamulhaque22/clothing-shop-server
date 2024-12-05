import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from './config/cloudinay-config.type';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (configService: ConfigService<CloudinaryConfig>) => {
    return cloudinary.config({
      cloud_name: configService.getOrThrow<string>('cloudinary.cloudName', {
        infer: true,
      }),
      api_key: configService.getOrThrow<string>('cloudinary.apiKey', {
        infer: true,
      }),
      api_secret: configService.getOrThrow<string>('cloudinary.apiSecret', {
        infer: true,
      }),
    });
  },
};
