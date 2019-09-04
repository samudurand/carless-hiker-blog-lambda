const instaApi = require('instagram-private-api');

exports.sendToInstagram = async (images) => {
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