const fs = require("fs");
const Twitter = require('twitter');

exports.sendToTwitter = async (text, images, link) => {

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_SECRET
    });

    console.info('Sending images to Twitter...');
    try {
        const imagesIds = await Promise.all(images.map(async (image) => {
            try {
                media = await client.post('media/upload', {media: image});
                return media.media_id_string;
            } catch (error) {
                console.error(error, error);
                throw new Error(error);
            }
        }));

        console.info(imagesIds);
        console.info('Sending tweet...');

        const status = {
            status: `${text} ${link}`,
            media_ids: imagesIds.join(',')
        };

        try {
            const result = await client.post('statuses/update', status);
            console.info(result);
        } catch (error) {
            console.error("Tweet upload failed", error);
            throw new Error(error);
        }

    } catch (error) {
        console.error("Media upload failed", error);
        throw new Error(error);
    }

    console.info('Sending successful!');
};