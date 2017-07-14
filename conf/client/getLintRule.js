import path from 'path';

export default () => {
  const result = [];
  if (!process.env.NODE_SKIP_LINT) {
    result.push({
      test: /\.jsx?$/,
      enforce: 'pre',
      exclude: /(node_modules|bower_components)/,
      loader: 'eslint-loader',
      options: {
        cache: true,
        configFile: path.join(process.cwd(), '.eslintrc.yml'),
      },
    });
  }

  return result;
};
