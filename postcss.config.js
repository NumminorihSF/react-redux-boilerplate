/**
 * Created by numminorihsf on 25.10.16.
 */
const browsers = require('./package.json').browsers;

module.exports = function (ctx) {
  return {
    parser: ctx.sugar ? 'sugarss' : false,
    map: ctx.env === 'development' ? ctx.map : false,
    from: ctx.from,
    to: ctx.to,
    plugins: {
      'autoprefixer': {
        browsers
      }
    }
  }
};