const S3 = require('aws-sdk/clients/s3');
const _ = require('lodash');

class DataRiver {
  constructor(config) {
    this.createS3Connection(config);
    this.s3UploadButchSize = config.s3UploadButchSize;
  };

  createS3Connection(config) {
    this.s3Source = new S3({
      accessKeyId: config.s3SourceAccessKey,
      secretAccessKey: config.s3SourceSecretAccessKey,
      params: {
        Bucket: config.s3SourceBucket,
      },
    });

    this.s3Target = new S3({
      accessKeyId: config.s3TargetAccessKey,
      secretAccessKey: config.s3TargetSecretAccessKey,
      params: {
        Bucket: config.s3TargetBucket,
      }
    });
  }

  getAllObjects(source) {
    return new Promise((res, rej) => {
      let tmpArr = [];
      const list = (source, IsTruncated = true, ContinuationToken) => {
        if (IsTruncated) {
          source.listObjectsV2({ ContinuationToken }).promise()
            .then(data => {
              tmpArr = [...tmpArr, ...data.Contents];
              list(source, data.IsTruncated, data.NextContinuationToken);
            })
            .catch(rej);
        } else {
          res(tmpArr);
        }
      }
      list(source);
    })
  };

  migrate(source, target, keys) {
    return Promise.all(keys.map(Key =>
      source.getObject({ Key }).promise()
        .then(data =>
          target.upload({ Body: data.Body, Key }).promise()
        )));
  }

  migrateByChunks() {
    return this.getAllObjects(this.s3Source)
      .then(obj => obj.map(o => o.Key))
      .then(keys => _.chunk(keys, this.s3UploadButchSize).map(chunk => this.migrate.bind(null, this.s3Source, this.s3Target, chunk))
        .reduce((acc, fn) => acc.then(resultsArr =>
          fn().then(data => [...resultsArr, ...data])), Promise.resolve([])));
  };
};

module.exports = DataRiver;
