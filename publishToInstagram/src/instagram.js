const instaApi = require('instagram-private-api');

const hashtags = "#hike #hiker #hiking #nature #landscapephotography #walks #explorer";

exports.sendToInstagram = async (description, images) => {
    const ig = new instaApi.IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);

    console.info('Authenticating with Instagram...');
    const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
    console.info('Authentication successful!');

    console.info('Sending album to Instagram...');
    const publishResult = await ig.publish.album({
        items: images, // images buffers
        caption: `${description} \n Check my blog for details and maps (link in my profile)! ${hashtags}`
    });
    console.info(publishResult); // publishResult.status should be "ok"

    console.info('Sending successful!');
};