import AWS from "aws-sdk";
require("dotenv").config();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESSKEY,
    secretAccessKey: process.env.AWS_SECRETKEY,
});

const myBucket = new AWS.S3({
    params: { Bucket: process.env.AWS_S3_BUCKET },
    region: process.env.AWS_REGION,
});

export const uploadFileS3 = (file, nameFile) => {
    const params = {
        ACL: 'public-read-write',
        Body: file,
        Bucket: process.env.AWS_S3_BUCKET,
        Key: nameFile,
        ContentType: "image/jpeg",
    };

    return new Promise((resolve, reject) => {
        try {
            myBucket.upload(params, (err, data) => {
              console.log('err>>',err);
                if (err) {
                    reject(err)
                } else {
                    // data.Location chứa URL của file tải lên
                    resolve(data)
                }
            });
        } catch (err) {
          console.log('err>>', err);
            reject(err)
        }
    })
};

export const deleteFileS3 = (keyFile) => {
    const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: keyFile,
    };

    return new Promise((resolve, reject) => {
        try {
            myBucket.deleteObject(params, (err, data) => {
                if (err) {
                    console.log("🚀 ~ err:", err, data)
                    reject(err)
                } else {
                    // data.Location chứa URL của file tải lên
                    resolve(true)
                }
            });
        } catch (err) {
            console.log("🚀 ~ err:", err)
            reject(err)
        }
    })
}