import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { EmailModule } from './email/email.module';
import { TestController } from './test/test.controller'; // Import TestController directly

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the application
    }),
    PrismaModule,
    SupabaseModule, // Import SupabaseModule
    EmailModule, // Import EmailModule
  ],
  controllers: [TestController], // Add TestController here
  providers: [],
})
export class AppModule {}
