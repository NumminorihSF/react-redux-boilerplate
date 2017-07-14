import Config from 'webpack-config';

console.warn('THERE IS NO CONFIG FOR SERVER. EXIT.');

process.exit(0);

export default new Config().merge({});
