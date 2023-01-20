import multerS3 from 'multer-s3';
import multer from 'multer';
import dotenv from 'dotenv';
import { S3Client } from '@aws-sdk/client-s3';
dotenv.config();

const s3 = new S3Client({
    credentials: {
        secretAccessKey: process.env.KEY_SECRET_AMAZON,
        accessKeyId: process.env.KEY_ID_AMAZON
    },
    region: process.env.REGION_S3_AMAZON,
    bucket: process.env.BUCKET_IMAGE_AMAZON,
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: multerS3({
        s3: s3,
        acl: 'public-read',
        bucket: process.env.BUCKET_IMAGE_AMAZON,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            console.log('storage - key', file);
            cb(null, file.originalname);  //use Date.now() for unique file keys
        }
    }),
    // filter: fileFilter
});



export default upload;