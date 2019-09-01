const xmlBodyJson = require('./resources/test-rss-message.json');
const rewire = require('rewire');
const index = require('../index');

const indexInternal = rewire('../index.js');
const extractGithubName = indexInternal.__get__('extractGithubName');

test('extract github name', () => {
    const name = extractGithubName("http://the-carless-hiker.com/2019/08/18/darwen-tower-to-sunnyhurst-brook/")
    expect(name).toBe('2019-08-18-darwen-tower-to-sunnyhurst-brook');
});

test('extract url from rss update message', async () => {
    const result = await index.handler(xmlBodyJson, null);
    expect(result).toBe('empty body');
});