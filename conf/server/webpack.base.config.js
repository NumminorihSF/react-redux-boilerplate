import Config from 'webpack-config';

console.log('THERE IS NO CONFIG FOR SERVER. EXIT.');

process.exit(0);

export default new Config().merge({});
