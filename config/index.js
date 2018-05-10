require('dotenv').config({ path: './env' });

module.exports = {
  s3SourceAccessKey: process.env.S3_SOURCE_ACCESS_KEY,
  s3SourceSecretAccessKey: process.env.S3_SOURCE_SECRET_ACCESS_KEY,
  s3SourceBucket: process.env.S3_SOURCE_BUCKET,
  s3TargetAccessKey: process.env.S3_TARGET_ACCESS_KEY,
  s3TargetSecretAccessKey: process.env.S3_TARGET_SECRET_ACCESS_KEY,
  s3TargetBucket: process.env.S3_TARGET_BUCKET,
  s3UploadButchSize: process.env.UPLOAD_BUNCH_SIZE,
};
