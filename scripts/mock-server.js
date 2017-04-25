import path from 'path';

import jsonServer from 'json-server';

import routes, { PREFIX } from '../conf/mock.server.routes';


const server = jsonServer.create();
const router = (function(){
  try {
    return jsonServer.router(path.resolve(process.cwd(), 'tmp/fake-db.json'));
  }
  catch(e){
    throw new Error('Please run "npm run gen:mock:data" before start mock-server.');
  }
}());
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(PREFIX, jsonServer.rewriter(routes));
server.use(PREFIX, router);

server.listen(process.env.PORT || 4000, function(){
  console.log('Mock-server started.');
});
