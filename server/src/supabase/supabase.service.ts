import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { FileOptions } from '@supabase/storage-js'; // Import FileOptions

@Injectable()
export class SupabaseService implements OnModuleInit {
  public supabase: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key not found in environment variables.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  // Example method for uploading a file
  async uploadFile(bucketName: string, filePath: string, file: Buffer, options?: FileOptions) {
    const { data, error } = await this.supabase.storage.from(bucketName).upload(filePath, file, options);
    if (error) {
      throw error;
    }
    return data;
  }

  // Example method for getting a public URL
  getPublicUrl(bucketName: string, filePath: string) {
    const { data } = this.supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  }

  // Add more methods as needed (e.g., download, delete)
}
