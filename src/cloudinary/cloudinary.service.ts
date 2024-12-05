// cloudinary.service.ts

import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
  /**
   * Uploads a file to Cloudinary
   * @param file The file to upload
   * @param folderName The folder name to upload the file to
   */
  uploadFile(
    file: Express.Multer.File,
    folderName: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folderName,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      const bufferToStream = (buffer: Buffer): Readable => {
        const stream = new Readable();
        stream.push(buffer);
        stream.push(null);
        return stream;
      };

      bufferToStream(file.buffer).pipe(uploadStream);
    });
  }

  removeFile(id: string) {
    cloudinary.uploader.destroy(id, {
      resource_type: 'image',
      invalidate: true,
    });
  }
}
