const fs = require("fs");
const Twitter = require('twitter');

exports.sendToTwitter = async (images) => {

    const client = new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: process.env.TWITTER_ACCESS_KEY,
        access_token_secret: process.env.TWITTER_ACCESS_SECRET
    });

    // let writeStream = fs.createWriteStream('image0.jpeg');
    // writeStream.write(images[0], 'binary');
    // writeStream.on('finish', () => {
    //     console.log('wrote all data to file');
    // });
    // writeStream.end();

    // await fs.writeFile('image0.jpg', images[0], (error) => console.error('Could not write down the image', error));

    // await client.post('media/upload', {media: 'image0.jpeg'}, async (error, media, response) => {
    console.info('Sending images to Twitter...');
    try {
        await client.post('media/upload', {media: images[0].file});

        console.info('Sending tweet...');

        const status = {
            status: 'I am a tweet',
            media_ids: media.media_id_string
        };

        try {
            await client.post('statuses/update', status);
        } catch (error) {
            console.error(`Tweet upload failed: \n ${JSON.stringify(error)}`);
            throw new Error(error);
        }

    } catch (error) {
        console.error(`Media upload failed: \n ${JSON.stringify(error)}`);
        throw new Error(error);
    }

    console.info('Sending successful!');
};