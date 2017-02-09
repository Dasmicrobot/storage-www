# storage-www

### Requirements

- Installed `node.js`
- Installed `Grunt` (`npm install grunt-cli`)
- Installed dependencies `npm install`

### Grunt commands

`grunt build` - will build site into `dist` directory with minified css and js files
`grunt deploy --bucket=myS3BucketName` - will push site to S3 bucket, provided that AWS key and secret env variables are correct

### Travis integration

Travis script runs build on every commit and when on `master` will push site to S3 bucket as well
