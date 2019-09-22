const convert = require('xml-js');
const util = require('util');
const request = require("request-promise");
const aws = require("aws-sdk");

// Used to browse the github api trees and list the images
const postsApiRepoGithubURL = 'https://api.github.com/repos/samudurand/carless-hiker-blog/git/trees/cf1db899423cdbff064210ecd8f9d0564a4d2ff1';
// Used to download the images
const postsDirectRepoGithubURL = 'https://github.com/samudurand/carless-hiker-blog/raw/master/source/_posts/';

function extractGithubName(url) {
    const parts = url.split('/');
    return `${parts[3]}-${parts[4]}-${parts[5]}-${parts[6]}`;
}

const getImageUrls = async (postGithubRepoName) => {

    let fileTree = null;
    try {
        fileTree = await request({
            uri: postsApiRepoGithubURL,
            method: "GET",
            headers: {
                'User-Agent': 'samudurand'
            },
            json: true
        });
    } catch (error) {
        console.error('Could not retrieve the file tree from github.', error);
        throw error;
    }

    const folderUrl = fileTree.tree.find(object => object.path === postGithubRepoName).url;

    let folderTree = null;
    try {
        folderTree = await request({
            uri: folderUrl,
            method: "GET",
            headers: {
                'User-Agent': 'samudurand'
            },
            json: true
        });
    } catch (error) {
        console.error('Could not get blog post folder content from github.', error);
        throw error;
    }

    return folderTree.tree
        .map(object => object.path)
        .filter((name => name.endsWith('jpeg') || name.endsWith('jpg') || name.endsWith('png')))
        .map(name => postsDirectRepoGithubURL + postGithubRepoName + '/' + name);
};

const publishMessage = async (msg) => {
    const topic_arn = process.env.SNS_TOPIC_ARN;
    aws.config.update({region: process.env.REGION});

    const params = {
        Message: JSON.stringify(msg),
        TopicArn: topic_arn
    };

    const sns = new aws.SNS();
    try {
        const result = await sns.publish(params).promise();
        console.log('Successfully published message: \n' + JSON.stringify(params, null, 4));
        console.log("SNS Message ID is " + result.MessageId);
        return result;
    } catch (err) {
        console.error(err, err.stack);
        throw err;
    }
};

function getDescription(body) {
    const paragraphs = body.split('<p>');
    const description = paragraphs[paragraphs.length - 2];
    return description.replace("</p>", "");
}

exports.handler = async (event, context) => {

    const rssUpdateContent = JSON.parse(convert.xml2json(event.body, {compact: true, spaces: 2}));
    const rssBodyContent = rssUpdateContent.feed.entry.summary._text;
    const linkToPost = rssUpdateContent.feed.entry.link._attributes.href;
    const postGithubRepoName = extractGithubName(linkToPost);
    const imageUrls = await getImageUrls(postGithubRepoName);
    const description = getDescription(rssBodyContent);
    const message = {
        "linkToPost": linkToPost,
        "imageUrls": imageUrls,
        "description": description
    };

    console.info("Message to send " + JSON.stringify(message));
    await publishMessage(message);

    return  {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(message),
        "isBase64Encoded": false
    };
};