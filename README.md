# carless-hiker-blog-lambda
Lambda function receiving rss messages from Superfeedr and sending to instagram and twitter

## Deployment

To deploy to lambda, you will need the `node-lambda` library installed, with an aws `perso` (or other) profile.

```bash
$ npm install node-lambda -g
```

Then use the following commands, the first to package the code into a zip file, and the next to push the changes to aws:

```bash
$ node-lambda package
$ aws lambda update-function-code --function-name receiveBlogRssFeed --zip-file fileb://./build/carless-hiker-blog-lambda-development.zip --profile perso
```