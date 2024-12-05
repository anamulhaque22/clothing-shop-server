import { FacebookConfig } from 'src/auth-facebook/config/facebook-config.type';
import { GoogleConfig } from 'src/auth-google/config/google-config.type';
import { AuthConfig } from 'src/auth/config/auth-config.type';
import { CloudinaryConfig } from 'src/cloudinary/config/cloudinay-config.type';
import { MailConfig } from 'src/mail/config/mail-config.types';
import { StripeConfig } from 'src/stripe/config/stripe-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { AppConfig } from './app-config.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  mail: MailConfig;
  cloudinary: CloudinaryConfig;
  stripe: StripeConfig;
  google: GoogleConfig;
  facebook: FacebookConfig;
};
