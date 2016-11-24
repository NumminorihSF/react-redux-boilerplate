For using this you should have node.js (v6+ lts), npm.

After clone run: `npm install` to install deps.


# npm commands

### Build

To build frontend server or get static files use:
```
npm run build
```
It will build production server with minified js and css.

To build dev-frontend server use:
```
npm run build:dev
```

### Start frontend server
To start frontend server you should **build** it and run:
```
API_BASE_URL=$URL npm start
```
API_BASE_URL is some URL, there you can find API and call it.

**Warn!** On Production env (`NODE_ENV=production`) React does not check propTypes.


### Start development server
To start development server (it rebuild project faster on changes) - run 
```
npm run dev:server
```
Dev-server run `lint` and `test` steps on every project rebuild



### Test

To start test once - run:
```
npm run test
```

If project is in active develop - you can use:
```
npm run test:watch
```
**Warn!** It does not apply new test files. If you add new test file - rerun `test:watch`.



### Lint

To start lint - run:
```
npm run lint
```
If everything is ok, it just exit. 
If something wrong, it errors every trouble to console. 

There can be come troubles, that eslint can fix by itself.
To use this feature run lint by:
```
npm run lint:fix
```


## API usage

### Single call
Dispatching event with object with [CALL_API] key generates 1 API request.
Value of CALL_API key should be an object with fields.
Fields available:
 * method {String} - HTTP method (GET, POST, PUT, ...)
 * cookie {Object} - pass an src/client/cookie module from client
 * path {String} - HTTP url pathname (remember, that middleware append API_BASE_URL env before this pathname)
 * query {Object} - query object
 * body {Object|String} - HTTP request's body.
 * startType {String|Symbol} - ActionType to dispatch before api call. Action object will be:
    ` { type: params.startType, url : params.url , query : params.query} ` There url is full url.
 * beforeStart {Function} - Function to call before api call.
 * successType {String|Symbol} - ActionType to dispatch on success api call. Action object will be:
    ` { type: params.successType, response : responseBody} `
 * errorType {String|Symbol} - ActionType to dispatch on error api call. Action object will be:
    ` { type: params.successType, error : anErrorObject} `
 * afterSuccess {Function} - Function to call then api call succeeds.
 * afterError {Function} - Function to call then api call errors.


 example:
```
     import { CALL_API } from 'middleware/api'
     export function loadQuestions() {
       return {
         [CALL_API]: {
           method: 'get',
           path: '/api/questions',
           successType: LOADED_QUESTIONS
         }
       }
     }
```

### Chain calls
 Dispatching event with object with [CHAIN_API] key generates many chained API request.
 Value of CHAIN_API key should be an array with functions returning CALL_API actions.
 Every function will got previous response's body as an argument.

 example:
```
     import { CALL_API, CHAIN_API } from 'middleware/api'
     export function loadQuestionDetail ({ id, history }) {
      return {
        [CHAIN_API]: [
          ()=> {
            return {
              [CALL_API]: {
                method: 'get',
                path: `/api/questions/${id}`,
                startType: LOAD_QUESTION_DETAIL,
                successType: LOADED_QUESTION_DETAIL,
                afterError: ()=> {
                  history.push('/')
                }
              }
            }
          },
          (question) => {
            return {
              [CALL_API]: {
                method: 'get',
                path: `/api/users/${question.userId}`,
                successType: LOADED_QUESTION_USER
              }
            }
          }
        ]
      }
    }
```