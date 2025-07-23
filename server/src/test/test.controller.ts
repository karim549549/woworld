import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service';
import { EmailService } from '../email/email.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly emailService: EmailService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    const bucketName = 'test-uploads'; // IMPORTANT: Create this bucket in your Supabase Storage
    const filePath = `test/${Date.now()}-${file.originalname}`;

    try {
      const { path } = await this.supabaseService.uploadFile(bucketName, filePath, file.buffer, {
        contentType: file.mimetype,
      });
      const publicUrl = this.supabaseService.getPublicUrl(bucketName, path);
      return { message: 'File uploaded successfully', path, publicUrl };
    } catch (error: any) { // Explicitly type error as any for message access
      console.error('Supabase upload error:', error);
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  @Get('health-blob')
  async healthCheckBlob(): Promise<string> {
    try {
      const { data, error } = await this.supabaseService.supabase.storage.listBuckets();
      if (error) {
        throw new InternalServerErrorException(`Supabase Storage error: ${error.message}`);
      }
      return `Supabase Storage connected. Found ${data.length} buckets.`;
    } catch (error: any) { // Explicitly type error as any for message access
      console.error('Supabase Blob Health Check Error:', error);
      throw new InternalServerErrorException(`Supabase Blob Health Check Failed: ${error.message}`);
    }
  }

  @Get('health-email')
  async healthCheckEmail(): Promise<string> {
    const testEmailRecipient = 'karimkhaled549@gmail.com';
    const templateName = 'welcome'; // Corresponds to welcome.mjml
    const templateData = {
      name: 'Karim',
      ctaUrl: 'https://www.woworld.net',
    };

    try {
      await this.emailService.sendMail(testEmailRecipient, 'Welcome to Woworld!', templateName, templateData);
      return `Test email sent successfully to ${testEmailRecipient} using template ${templateName}`;
    } catch (error: any) { // Explicitly type error as any for message access
      console.error('Email Health Check Error:', error);
      throw new InternalServerErrorException(`Email Health Check Failed: ${error.message}`);
    }
  }

  @Get('test-error')
  testError(): string {
    throw new InternalServerErrorException('This is a test error from the backend.');
  }
}