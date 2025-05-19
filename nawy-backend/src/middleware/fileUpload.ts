import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { Readable } from 'stream';


cloudinary.config({
  cloud_name: 'dpgdllowo',
  api_key: '845638656935418',
  api_secret: '6PGL4Idl-BORIbOFA5uNL_IEEjU',
  secure:true
});

// CLOUD_NAME_KEY=dpgdllowo
// CLOUD_API_KEY=6PGL4Idl-BORIbOFA5uNL_IEEjU
// CLOUD_SECRET_KEY=6PGL4Idl-6PGL4Idl-BORIbOFA5uNL_IEEjU
// Extend Express Request to include file properties
declare global {
  namespace Express {
    interface Request {
      fileUrls?: string[];
    }
    
    namespace Multer {
      interface File {
        cloudinaryUrl?: string;
      }
    }
  }
}

const uploadToCloudinary = (file: Express.Multer.File, folder = 'uploads'): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder, 
        resource_type: 'auto',
        format: 'webp' 
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed'));
        resolve(result);
      }
    );
    
    const readableStream = Readable.from(file.buffer);
    readableStream.pipe(uploadStream);
  });
};

const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  }
});

export const uploadSingleFile = (fieldName: string, folder = 'uploads') => [
  upload.single(fieldName),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) return next();
      
      const result = await uploadToCloudinary(req.file, folder);
      
      req.file.cloudinaryUrl = result.secure_url;
      req.fileUrls = [result.secure_url];
      
      next();
    } catch (error) {
      next(error);
    }
  }
];

export const uploadMultipleFiles = (fieldName: string, maxCount = 5, folder = 'uploads') => [
  upload.array(fieldName, maxCount),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) return next();
      
      const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
      const results = await Promise.all(uploadPromises);
      
      files.forEach((file, index) => {
        file.cloudinaryUrl = results[index].secure_url;
      });
      
      req.fileUrls = results.map(result => result.secure_url);
      
      next();
    } catch (error) {
      next(error);
    }
  }
];

export const uploadFields = (fields: { name: string; maxCount: number }[], folder = 'uploads') => [
  upload.fields(fields),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filesMap = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (!filesMap) return next();
      
      const allFiles: Express.Multer.File[] = [];
      const fieldNames = Object.keys(filesMap);
      
      fieldNames.forEach(fieldName => {
        const fieldFiles = filesMap[fieldName];
        allFiles.push(...fieldFiles);
      });
      
      if (allFiles.length === 0) return next();
      
      const uploadPromises = allFiles.map(file => uploadToCloudinary(file, folder));
      const results = await Promise.all(uploadPromises);
      
      let fileIndex = 0;
      req.fileUrls = [];
      
      fieldNames.forEach(fieldName => {
        const fieldFiles = filesMap[fieldName];
        
        fieldFiles.forEach(file => {
          file.cloudinaryUrl = results[fileIndex].secure_url;
          req.fileUrls!.push(results[fileIndex].secure_url);
          fileIndex++;
        });
      });
      
      next();
    } catch (error) {
      next(error);
    }
  }
];