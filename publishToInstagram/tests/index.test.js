const snsMessage = require('./resources/test-sns-message.json');
const index = require('../index');

test('extract url from rss update message', async () => {
    process.env.REGION = 'eu-west-2';
    const result = await index.handler(snsMessage, null);
    expect(result).toBe('Successfully sent to Instagram');
}, 60000);