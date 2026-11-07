const base = require('./playwright.config');
module.exports = { ...base, testMatch: 'seo.spec.js', reporter: [['list']], outputDir: require('path').resolve(__dirname, '../../test-results/seo-runs') };
