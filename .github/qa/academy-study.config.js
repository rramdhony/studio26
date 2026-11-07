const base = require('./playwright.config');
module.exports = {
  ...base,
  testMatch: 'academy-study.spec.js',
  reporter: [['list']],
  use: {
    ...base.use,
    baseURL: 'http://127.0.0.1:3002',
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] },
  },
  outputDir: require('path').resolve(__dirname, '../../test-results/academy-study'),
};
