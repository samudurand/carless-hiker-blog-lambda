const request = require("request-promise");

exports.handler = async (event, context) => {
    console.info("Received notification: \n" + JSON.stringify(event, null, 2));

    const message = event.Records[0].Sns.Message;
    console.info("Extracted message: \n" + JSON.stringify(JSON.parse(message), null, 2));

    return "Successfully sent to Instagram";
};