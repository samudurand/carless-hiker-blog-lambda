const xmlBodyJson = require('./resources/test-rss-message.json');
const index = require('../index');

test('parse body in rss update message', () => {
    expect(emptyBodyJson.body).toBe('empty body');
});

test('extract url from rss update message', () => {
    expect(xmlBodyJson.body).toBe('empty body');
});