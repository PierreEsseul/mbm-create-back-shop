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


const fileTypes = /jpeg|JPEG|jpg|JPG|png|PNG|gif|GIF|webp|WEBP/;
const fileFilter = function(req, file, cb) {
    if (fileTypes.test(file.mimetype)) {
        return cb(null, true)
    }
    req.errorMessage = `Wrong extension type (${file.mimetype})`;
    req.errorErrno = 10;
    cb(null, false)
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
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
    fileFilter: fileFilter
});



export default upload;