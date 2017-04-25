module.exports = function (ctx) {
  return {
    parser: ctx.sugar ? 'sugarss' : false,
    map: ctx.env === 'production' ? false : ctx.map,
    from: ctx.from,
    to: ctx.to,
    plugins: {
      autoprefixer: {},
    },
  };
};
