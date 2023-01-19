import fs from 'fs';
import AWS from 'aws-sdk';

async function saveImgS3(image) {
    // configure AWS
    AWS.config.update({
        accessKeyId: `${process.env.AWS_ACCESS_KEY}`,
        secretAccessKey: `${process.env.AWS_SECRET_KEY}`
    });

    // create an instance of S3
    const s3 = new AWS.S3();

    // name of the bucket and the file
    const bucketName = 'image-article-bucket';
    const filePath = image.path;

    // read the contents of the file
    // const fileContent = fs.readFileSync(filePath);
    const fileContent = "merdemerde";
    // parameters to upload the file
    const params = {
        Bucket: bucketName,
        Key: image.name,
        Body: fileContent
    };

    console.log("Value params : ", params);


    // upload the file
    s3.upload(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Value data.Location : ${data.Location}`);
        }
    });
}

export default saveImgS3;