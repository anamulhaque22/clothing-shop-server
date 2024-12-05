import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { StripeConfig } from './stripe-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  STRIPE_SECRET_KEY: string;

  @IsString()
  STRIPE_API_VERSION: string;

  @IsString()
  STRIPE_WEBHOOK_SECRET: string;
}

export default registerAs<StripeConfig>('stripe', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secretKey: process.env.STRIPE_SECRET_KEY,
    apiVersion: process.env.STRIPE_API_VERSION,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  };
});
