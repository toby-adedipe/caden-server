import * as dotenv from 'dotenv';

dotenv.config();

class EnvConfig {
  static nodeEnv?: string | undefined = process.env.NODE_ENV;


  public static localConfig() {
    return {
      nodeEnv: this.nodeEnv
    }
  }

  public static prodConfig() {
    return {
      nodeEnv: this.nodeEnv
    }
  }

  public static stageConfig() {
    return {
      nodeEnv: this.nodeEnv
    }
  }

  public static testConfig() {
    return {
      nodeEnv: this.nodeEnv
    }
  }

  public static devConfig() {
    return {
      nodeEnv: this.nodeEnv
    }
  }

  public static loadConfig() {
    if (this.nodeEnv === 'production' || this.nodeEnv === 'prod') {
      return this.prodConfig();
    }
    if (this.nodeEnv === 'staging' || this.nodeEnv === 'stag') {
      return this.stageConfig();
    }
    if (this.nodeEnv === 'testing' || this.nodeEnv === 'test') {
      return this.testConfig();
    }
    if (this.nodeEnv === 'development' || this.nodeEnv === 'dev') {
      return this.devConfig();
    }
    return this.localConfig();
  }
}

export const envConfig = EnvConfig.loadConfig();