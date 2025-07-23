import { Module, Global } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule], // Import ConfigModule to use ConfigService
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}