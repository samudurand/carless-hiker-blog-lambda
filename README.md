# carless-hiker-blog-lambda
Lambda function receiving rss messages from Superfeedr and sending to instagram and twitter

## Deployment

To deploy to lambda, you will need the `node-lambda` library installed, with an aws `perso` (or other) profile.

```bash
$ npm install node-lambda -g
```

Then use the following commands, the first to package the code into a zip file, and the next to push the changes to aws:

```bash
$ cd `function_name`
$ node-lambda package --functionName functionName
$ aws lambda update-function-code --function-name functionName --zip-file fileb://./build/functionName-development.zip --profile perso
```