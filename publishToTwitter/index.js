const {getRandomElements, downloadAndResizeImages} = require("./src/utils");
const {sendToTwitter} = require("./src/twitter");

exports.handler = async (event, context) => {
    console.info("Received notification: \n" + JSON.stringify(event, null, 2));
    const message = JSON.parse(event.Records[0].Sns.Message);

    let numberToPost = 4; // Max number of media by tweet
    // Get the cover image, if it exists
    const coverUrl = message.imageUrls.find((url) => url.includes('/cover.'));
    if (coverUrl) {
        numberToPost -= 1;
    }

    const imagesUrlsWithoutCover = message.imageUrls.filter((value, index, arr) => value !== coverUrl);
    // Limit the number of remaining images, and take a random selection of them
    const imagesUrlsSelection = imagesUrlsWithoutCover.length <= numberToPost ? imagesUrlsWithoutCover : getRandomElements(imagesUrlsWithoutCover, numberToPost);

    // Add the cover image, if it exists
    if (coverUrl) {imagesUrlsSelection.unshift(coverUrl);}

    const images = await downloadAndResizeImages(imagesUrlsSelection);

    const maxTextLength = 250;  // To be sure to fit twitter limits
    const description = message.description.length > maxTextLength ? message.description.substring(0, maxTextLength - 3) + "..." : message.description;
    await sendToTwitter(description, images, message.linkToPost);

    return "Successfully sent to Twitter";
};