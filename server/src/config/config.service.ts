import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    const Nodeenv = this.configService.get<string>('NODE_ENV');
    if (!Nodeenv) {
      throw new Error('NODE_ENV is not defined');
    }
    return Nodeenv;
  }

  get port(): number {
    const Port = this.configService.get<number>('PORT');
    if (!Port) {
      throw new Error('PORT is not defined');
    }
    return Port;
  }

  get databaseUrl(): string {
    const DatabaseUrl = this.configService.get<string>('DATABASE_URL');
    if (!DatabaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }
    return DatabaseUrl;
  }

  get jwtConfig() {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
    };
  }

  get redisConfig() {
    return {
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      ttl: this.configService.get<number>('REDIS_TTL'),
    };
  }

  get apiConfig() {
    return {
      prefix: this.configService.get<string>('API_PREFIX'),
      version: this.configService.get<string>('API_VERSION'),
    };
  }

  get throttleConfig() {
    return {
      ttl: this.configService.get<number>('THROTTLE_TTL'),
      limit: this.configService.get<number>('THROTTLE_LIMIT'),
    };
  }
}
