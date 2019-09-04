const instaApi = require('instagram-private-api');
const request = require("request-promise");
const sharp = require('sharp');

const getAndResizeImages = async (imageUrls) => {
    const images = [];
    for (let i=0; i < imageUrls.length; i++) {
        const imageContent = await request.get({
            url: imageUrls[i],
            encoding: null, // this is required
        });

        const imageBuffer = Buffer.from(imageContent, 'binary');

        const imageResized = await sharp(imageBuffer)
            .resize({height: 800})
            .resize({
                width: 800,
                height: 800,
                fit: sharp.fit.cover
            })
            .toBuffer();

        images[i] = {
            file: imageResized
        }
    }
    return images;
};

const getRandomElements = function(sourceArray, neededElements) {
    const result = [];
    for (var i = 0; i < neededElements; i++) {
        var index = Math.floor(Math.random() * sourceArray.length);
        result.push(sourceArray[index]);
        sourceArray.splice(index, 1);
    }
    return result;
};

const sendToInstagram = async (images, linkToPost) => {
    const ig = new instaApi.IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);

    console.info('Authenticating with Instagram...');
    const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    console.info('Authentication successful!');

    console.info('Sending album to Instagram...');
    const publishResult = await ig.publish.album({
        items: images, // images buffers
        caption: `A new hike to checkout! Check my blog to know more (link in my profile).`
    });
    console.info(publishResult); // publishResult.status should be "ok"
    console.info('Sending successful!');
};

exports.handler = async (event, context) => {
    console.info("Received notification: \n" + JSON.stringify(event, null, 2));

    const message = JSON.parse(event.Records[0].Sns.Message);
    console.info("Extracted message: \n" + JSON.stringify(message, null, 2));

    let numberToPost = 5;
    // Get the cover image, if it exists
    const coverUrl = message.imageUrls.find((url) => url.includes('/cover.'));
    if (coverUrl) {
        numberToPost -= 1;
    }

    const imagesUrlsWithoutCover = message.imageUrls.filter((value, index, arr) => value !== coverUrl);
    // Limit the number of remaining images, and take a random 4 of them
    const imagesUrlsSelection = imagesUrlsWithoutCover.length <= numberToPost ? imagesUrlsWithoutCover : getRandomElements(imagesUrlsWithoutCover, numberToPost);

    // Add the cover image, if it exists
    if (coverUrl) {imagesUrlsSelection.unshift(coverUrl);}

    const images = await getAndResizeImages(imagesUrlsSelection);
    await sendToInstagram(images, message.linkToPost);

    return "Successfully sent to Instagram";
};