const PREFIX = '/api/v1';

const routes = {};

export default Object.keys(routes).reduce((result, route) => {
  return {
    ...result,
    [`/${route}`]: routes[route]
  };
}, {});

export { PREFIX };
