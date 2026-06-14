import { BadRequestException, Inject } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { error } from "console";
import * as streamifier from 'streamifier';
export class CloudinaryService {
    constructor(
        @Inject('CLOUDINARY') private readonly cloudinary
    ){}

    async uploadImages (file : Express.Multer.File, folder : string = 'posts', publicId?: string) : Promise<UploadApiResponse> {
        if(!file) {
            throw new BadRequestException('File is required');
        }
        if(!file.mimetype.startsWith('image/')) {
            throw new BadRequestException('Only image files are allowed');
        }
        return new Promise((resolve, reject) => {
            const options: any = {
                folder,
                resource_type: 'image',
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
                quality: 'auto',
                fetch_format: 'auto',
            };

            if (publicId) {
                options.public_id = publicId;
                options.overwrite = true;
            }

            const uploadStream = this.cloudinary.uploader.upload_stream(
                options,
                (
                    error : UploadApiErrorResponse,
                    result : UploadApiResponse
                ) => {
                    if(error) {
                        return reject(error)
                    }
                    else {
                        resolve(result)
                    }
                }
            );
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteFile(publicId: string): Promise<void> {
        if (!publicId) {
            throw new BadRequestException('Public ID is required');
        }
        await this.cloudinary.uploader.destroy(publicId);
    }
}