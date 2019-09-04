const instaApi = require('instagram-private-api');
const request = require("request-promise");

const getRandomElements = function(sourceArray, neededElements) {
    var result = [];
    for (var i = 0; i < neededElements; i++) {
        var index = Math.floor(Math.random() * sourceArray.length);
        result.push(sourceArray[index]);
        sourceArray.splice(index, 1);
    }
    return result;
};

const sendToInstagram = async (imageUrls, linkToPost) => {
    const ig = new instaApi.IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);

    console.info('Authenticating with Instagram...');
    const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    console.info('Authentication successful!');

    const images = [];
    for (i=0; i < imageUrls.length; i++) {
        const imageContent = await request.get({
            url: imageUrls[0], // random picture with 800x800 size
            encoding: null, // this is required
        });
        images[i] = {
            file: Buffer.from(imageContent, 'binary')
        };
    }

    console.log('Sending album to Instagram...');
    // const publishResult = await ig.publish.photo({
    //     file: imageBuffer, // image buffer, you also can specify image from your disk using fs
    //     caption: 'Debug post, ignore it I am doing some tests ^^'
    // });
    const publishResult = await ig.publish.album({
        items: images, // image buffer, you also can specify image from your disk using fs
        caption: `A new hike to checkout! Click here to see more ${linkToPost}`
    });
    console.log(publishResult); // publishResult.status should be "ok"
    console.log('Sending successful!');
};

exports.handler = async (event, context) => {
    console.info("Received notification: \n" + JSON.stringify(event, null, 2));

    const message = JSON.parse(event.Records[0].Sns.Message);
    console.info("Extracted message: \n" + JSON.stringify(message, null, 2));

    // Get the cover image, if it exists
    const coverUrl = message.imageUrls.find((url) => url.includes('/cover.'));
    const imagesUrlsWithoutCover = message.imageUrls.filter((value, index, arr) => value === coverUrl);
    // Limit the number of remaining images, and take a random 4 of them
    const imagesUrlsSelection = imagesUrlsWithoutCover.length <= 4 ? imageUrls : getRandomElements(imageUrls, 4);
    imagesUrlsSelection.unshift(coverUrl);

    await sendToInstagram(imagesUrlsSelection, message.linkToPost);

    return "Successfully sent to Instagram";
};