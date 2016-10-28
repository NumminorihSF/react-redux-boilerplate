process.env.ON_SERVER = true;

import Express from 'express'
import path from 'path'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { useRouterHistory, RouterContext, match } from 'react-router'

import { createMemoryHistory, useQueries } from 'history'
import compression from 'compression'
import Promise from 'bluebird'


import { Provider } from 'react-redux'

import Helmet from 'react-helmet'
import morgan from 'morgan'

import configureStore from '../store/configureStore'
import createRoutes from '../routing/index'
import getCookieHelpers from './cookie'

let server = new Express();
let port = process.env.PORT || 3000;
let scriptSrcs;



let styleSrc;
if ( process.env.NODE_ENV === 'production' ) {
  let refManifest = require('../chunk-map.json'); // eslint-disable-line global-require
  scriptSrcs = [
    `/public/${refManifest['vendor.js']}`,
    `/public/${refManifest['app.js']}`
  ];
  styleSrc = `/public/${refManifest['app.css']}`
} else {
  scriptSrcs = [
    '/public/vendor.js',
    '/public/app.js'
  ];
  styleSrc = '/public/app.css'
}

server.use(morgan('short'));
server.use(compression());


if (process.env.NODE_ENV === 'production') {
  server.use('/assets', Express.static(path.join(__dirname, '../..', 'build/assets')));
  server.use('/public', Express.static(path.join(__dirname, '../..', 'build/public')))
} else {
  server.use('/assets', Express.static(path.join(__dirname, '../..', 'src/assets')));
  server.use('/public', Express.static(path.join(__dirname, '../..', 'build/public')));
}

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'pug');

// mock apis
server.get('/api/questions', (req, res)=> {
  let { questions } = require('./mock_api'); // eslint-disable-line global-require
  res.send(questions);
});

server.get('/api/users', (req, res)=> {
  let { users } = require('./mock_api'); // eslint-disable-line global-require
  res.send(users);
});

server.get('/api/users/:id', (req, res)=> {
  let { getUser } = require('./mock_api'); // eslint-disable-line global-require
  res.send(getUser(req.params.id));
});

server.get('/api/questions/:id', (req, res)=> {
  let { getQuestion } = require('./mock_api'); // eslint-disable-line global-require
  let question = getQuestion(req.params.id);
  if (question) {
    res.send(question);
  } else {
    res.status(404).send({ reason: 'question not found' })
  }
});

server.get('*', (req, res, next)=> {
  let history = useRouterHistory(useQueries(createMemoryHistory))();
  let store = configureStore();
  let routes = createRoutes(history);
  let location = history.createLocation(req.url);

  match({ routes, location }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(301, redirectLocation.pathname + redirectLocation.search)
    } else if (error) {
      res.status(500).send(error.message)
    } else if (renderProps === null || renderProps === undefined) {
      res.status(404).send('Not found')
    } else {
      let [ getCurrentUrl, unsubscribe ] = subscribeUrl();
      let reqUrl = location.pathname + location.search;

      getReduxPromise(renderProps, store, history, getCookieHelpers(req, res)).then(()=> {
        let reduxState = encodeURIComponent(JSON.stringify(store.getState()));
        let html = ReactDOMServer.renderToString(
          <Provider store={store}>
            { <RouterContext {...renderProps}/> }
          </Provider>
        );
        let metaHeader = Helmet.rewind();

        if ( getCurrentUrl() === reqUrl ) {
          res.render('index', { metaHeader, html, scriptSrcs, reduxState, styleSrc })
        } else {
          res.redirect(302, getCurrentUrl())
        }
        unsubscribe()
      })
      .catch((err)=> {
        Helmet.rewind();
        unsubscribe();
        next(err)
      });

    }
  });
  function subscribeUrl () {
    let currentUrl = location.pathname + location.search;
    let unsubscribe = history.listen((newLoc)=> {
      if (newLoc.action === 'PUSH' || newLoc.action === 'REPLACE') {
        currentUrl = newLoc.pathname + newLoc.search
      }
    });
    return [
      ()=> currentUrl,
      unsubscribe
    ]
  }
});

function getReduxPromise (renderProps, store, history, cookie) {
  let { query, params } = renderProps;
  let comp = renderProps.components[renderProps.components.length - 1].WrappedComponent;
  let promise = comp.fetchData ?
    comp.fetchData({ query, params, store, history, cookie }) :
    Promise.resolve();

  return promise;
}

server.use((err, req, res, next)=> {
  console.log(err.stack);
  // TODO report error here or do some further handlings
  res.status(500).send("something went wrong...")
});

console.log(`Server is listening to port: ${port}`);
server.listen(port);
