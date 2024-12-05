export type AppConfig = {
  nodeEnv: string;
  name: string;
  frontendCustomerDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
};
