import Config, { environment } from 'webpack-config';

const POSSIBLE_NODE_ENV = [
  'staging',
  'production',
  'dev-server',
];

const {
  TARGET: target = 'client',
  NODE_ENV: nodeEnv = 'staging',
} = process.env;

environment.setAll({
  env: () => POSSIBLE_NODE_ENV.find(env => env === nodeEnv) || POSSIBLE_NODE_ENV[0],
  target: () => target,
});

// Also you may use `'conf/webpack.[NODE_ENV].config.js'`
export default new Config().extend('conf/[target]/webpack.[env].config.js');
