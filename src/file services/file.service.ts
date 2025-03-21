import { Injectable, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { S3 } from 'aws-sdk';
import { Express } from 'express';

import * as fs from 'fs';



@Injectable()
export class ZohoMailService {
  private readonly apiUrl: string;
  private readonly authToken: string;
  private readonly fromAddress: string;

  constructor() {
    // Ensure these values are defined in your .env file.
    this.apiUrl = process.env.ZOHO_MAIL_API_URL || ''; // e.g., 'https://mail.zoho.com/api/accounts/{account_id}/messages'
    if (!this.apiUrl) {
      throw new Error('ZOHO_MAIL_API_URL is not defined in the environment variables');
    }
    this.authToken = process.env.ZOHO_MAIL_AUTH_TOKEN || ''; // Your Zoho Mail API OAuth token
    if (!this.authToken) {
      throw new Error('ZOHO_MAIL_AUTH_TOKEN is not defined in the environment variables');
    }
    this.fromAddress = process.env.ZOHO_MAIL_FROM || ''; // Sender email address
    if (!this.fromAddress) {
      throw new Error('ZOHO_MAIL_FROM is not defined in the environment variables');
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const payload = {
      fromAddress: this.fromAddress,
      toAddress: email,
      subject: 'Password Reset Request',
      content: `Please click the following link to reset your password: ${resetLink}`,
    };

    try {
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          Authorization: `Zoho-oauthtoken ${this.authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status !== 200) {
        throw new HttpException('Failed to send email via Zoho Mail', HttpStatus.BAD_GATEWAY);
      }
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new HttpException(`Error sending password reset email: ${error.message}`, HttpStatus.BAD_GATEWAY);
    }
  }

  async sendOtp(email: string, otp: string): Promise<void> {
    // Construct the email payload. Adjust the payload format according to Zoho Mail API requirements.
    const payload = {
      fromAddress: this.fromAddress,
      toAddress: email,
      subject: 'Your OTP Code',
      content: `Your OTP code is: ${otp}`,
    };

    try {
      // Make the HTTP POST request to Zoho Mail API.
      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          'Authorization': `Zoho-oauthtoken ${this.authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Check if the response indicates success.
      if (response.status !== 200) {
        throw new HttpException('Failed to send email via Zoho Mail', HttpStatus.BAD_GATEWAY);
      }
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw new HttpException(`Error sending OTP email: ${error.message}`, HttpStatus.BAD_GATEWAY);
    }
  }
}
@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g., 'my-cloud'
      api_key: process.env.CLOUDINARY_API_KEY,       // e.g., '1234567890'
      api_secret: process.env.CLOUDINARY_API_SECRET,   // e.g., 'my-secret'
    });
  }

  // Uploads an image file using Cloudinary's uploader API without specifying a folder.
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new InternalServerErrorException('File is missing');
      }

      // Upload the image file without specifying a folder.
      const result: UploadApiResponse = await cloudinary.uploader.upload(file.path);

      
      // Return the secure URL of the uploaded image.
      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new InternalServerErrorException('Image upload failed');
    }
  }
}

@Injectable()
export class CloudflareService {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`, // Cloudflare R2 URL
      accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID, 
      secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
      signatureVersion: 'v4',
    });
  }

  /*
  async uploadImage(file: MulterFile): Promise<string> {
    try {
      const fileStream = fs.createReadStream(file.path);

    let  fileName = 'image-' + Date.now()
      
      const uploadParams: S3.PutObjectRequest = {
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME as string, // R2 Bucket
        Key: fileName, // File name
        Body: fileStream,
        ContentType: file.mimetype,
      };

      await this.s3.upload(uploadParams).promise();

      return `https://${process.env.CLOUDFLARE_BUCKET_NAME}.r2.cloudflarestorage.com/${fileName}`;
    } catch (error) {
      console.error('Cloudflare R2 upload error:', error);
      throw new InternalServerErrorException('Image upload failed');
    }
  }
    */
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      if (!file) {
        throw new InternalServerErrorException('File is missing');
      }

      const fileName = `image-${Date.now()}-${file.originalname}`;

      const uploadParams: S3.PutObjectRequest = {
        Bucket: process.env.CLOUDFLARE_BUCKET_NAME as string, // R2 Bucket
        Key: fileName,
        Body: file.buffer, // Use buffer instead of file.path
        ContentType: file.mimetype,
        ACL: 'public-read', // Ensure it's publicly accessible
      };

      await this.s3.upload(uploadParams).promise();

      // Generate the correct public URL
      return `https://${process.env.CLOUDFLARE_BUCKET_NAME}.r2.dev/${fileName}`;
    } catch (error) {
      console.error('Cloudflare R2 upload error:', error);
      throw new InternalServerErrorException('Image upload failed');
    }
  }
}

