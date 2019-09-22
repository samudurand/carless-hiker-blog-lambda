const {getRandomElements, downloadAndResizeImages} = require("./src/utils");
const {sendToInstagram} = require("./src/instagram");

exports.handler = async (event, context) => {
    console.info("Received notification: \n" + JSON.stringify(event, null, 2));
    const message = JSON.parse(event.Records[0].Sns.Message);

    let numberToPost = 5;
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

    console.info("Dowloading images...");
    const images = await downloadAndResizeImages(imagesUrlsSelection);
    console.info("Images downloaded");
    console.info("Sending to Instagram");

    const maxTextLength = 1900; // To be sure to fit Instagram limits with the hashtags on top
    const description = message.description.length > maxTextLength ? message.description.substring(0, maxTextLength - 3) + "..." : message.description;
    await sendToInstagram(description, images);
    return "Successfully sent to Instagram";
};