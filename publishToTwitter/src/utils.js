const request = require("request-promise");

exports.downloadAndResizeImages = async (imageUrls) => {
    const images = [];
    for (let i=0; i < imageUrls.length; i++) {
        const imageContent = await request.get({
            url: imageUrls[i],
            encoding: null, // this is required
        });

        images[i] = Buffer.from(imageContent, 'binary');
    }
    return images;
};

exports.getRandomElements = function(sourceArray, neededElements) {
    const result = [];
    for (let i = 0; i < neededElements; i++) {
        var index = Math.floor(Math.random() * sourceArray.length);
        result.push(sourceArray[index]);
        sourceArray.splice(index, 1);
    }
    return result;
};