const base = require('./playwright.config');
module.exports = { ...base, testMatch: 'opening.spec.js', reporter: [['list']], outputDir: require('path').resolve(__dirname, '../../test-results/opening') };
