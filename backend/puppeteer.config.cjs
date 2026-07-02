// Source - https://stackoverflow.com/a/78936794
// Posted by Syntaxis
// Retrieved 2026-07-01, License - CC BY-SA 4.0

const { join } = require('path');
/**
* @type {import("puppeteer").Configuration}
*/
module.exports = { cacheDirectory: join(__dirname, '.cache', 'puppeteer') };