import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { EmailFactory } from './email.factory';

@Global()
@Module({
  imports: [ConfigModule], // Import ConfigModule to use ConfigService
  providers: [EmailService, EmailFactory],
  exports: [EmailService],
})
export class EmailModule {}
