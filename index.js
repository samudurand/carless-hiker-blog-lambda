const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

console.log('Loading function');

exports.handler = async (event, context) => {

    console.log(JSON.stringify(event, null, 2));

    var response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "text/plain"
        },
        // "body": JSON.stringify(responseBody),
        "body": "All good!",
        "isBase64Encoded": false
    };

    return response;
};