import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import type { StringValue } from 'ms';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>('cloudinary.cloudName'),
      api_key: this.configService.getOrThrow<string>('cloudinary.apiKey'),
      api_secret: this.configService.getOrThrow<string>('cloudinary.apiSecret'),
    });
  }

  uploadBuffer(buffer: Buffer, folder: string, publicId?: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {

      const options = {
        folder,
        resource_type: 'image' as const,
        ...(publicId ? { public_id: publicId} : {}),
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if(error || !result) return reject(error);

          resolve(result)
        }
      );
        
      
      Readable.from(buffer).pipe(uploadStream);
    });
  }

  async deleteByPublicId(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
