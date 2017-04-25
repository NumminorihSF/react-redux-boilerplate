For using this you should have node.js (v6+ lts) and npm.

After cloning repo run `npm i` and `npm run flow:prepare`.




#npm scripts


## git hooks
### prepush
Prepush hooks run lint and tests on repo, so push may be slow.
 
 
## install
### install:all
Force installs all dependencies (regular and development).
### install:production
Installs only regular dependencies.
### install:sonar (CI)
Installs packages needed for sonarqube reports.


## Sonar Qube
###sonar:report (CI)
Generates sonarqube report


## Linting
### lint
Runs eslint on src folder.
### lint:fix
Runs eslint with `fix` flag. Appends comas, semicolons and do other things, that eslint can do by itself.
### lint:changed
Runs eslint on changed files (much faster on big project than `npm run lint`).
### lint:watch
Watches src folder. Runs eslint on every changes at folder.
### lint:watch:changed
Watches src folder. Runs `lint:changed` on every changes at folder.
### lint:ci (CI)
Runs eslint at CI


## Type checking
### gen:types (Beta)
Takes api description from swagger and generates types.
### flow:prepare
Installs `flow-typed`. Takes typedocs for every package from node_modules (or generage mocks with `any` type).
### flow
Starts flow server at first time. Every time runs project's type checking.
### flow:watch
Watches src folder. Runs `flow` on every changes at folder.
### flow:ci (CI)
Runs flow type-checker on project at CI


## Testing
### test
Runs tests on project
### test:watch
Watches src folder. Runs tests on every changes at folder.
### test:ci (CI)
Runs tests on project at CI

## Building
There are some env variables, should be set to build application:
 - `API_BASE_URL` - url to API's root. For example `http://my-api.com`.
 By default it is `http://localhost:3001`.

### build
Builds production application.
### build:production
Builds dll and after builds production bundle. 
It is minified, has `process.env.NODE_ENV=production` and it builds slow source-maps.
### build:staging
Builds dll and after builds prodiction bundle.
It is not minified, has `process.env.NODE_ENV=staging` and it also builds slow source-maps.

## Development server
Development server use hot-module-replacement.
The recommended way for fast development is run `dev:server:fast` and run test, lint and flow in other threads.
### dev:server
Starts slow development server (slow because build start after linting and tests).
### dev:server:notest
Starts `dev:server` with skipping test. If you are using this, run test by yourself.
### dev:server:nolist
Starts `dev:server` with skipping lint. If you are using this, run lint by yourself.
### dev:server:fast
Starts `dev:server` with skipping lint and test. If you are using this, run test and lint by yourself.


# Project structure
- project-root/
    - build/ - build's artifacts
    - conf/ - config for build application
    - docker/ - configuration for fun application in docker
    - flow-typed/ directory there flow types for libs are stored
    - scripts/ - npm script to run everything on project
    - scr/ - sources
        - assets/ - directory for all static files in project (the best way to store near component it is needed by)
        - app/ - application root
            - wrappers/
            - components/
                - PageLayout.js
            - feature1(PopupHolder)/
                - actions.js
                - reducer.js
            - Conferences/
                - feature2.1/
                - feature2.2/
            - feature3/
            - actions.js
            - reducer.js
            - Page.js
            - getRoutes.js
        - components/ - base component directory (needed on every place of application and has should not be binded with any type of app's data)
            - Table/
            - Form/
            - Input/
            - Sidebar/
            - PageHeader/
            - ...
        - data/ - base models of project (actions and reducers)
        - store/ - sore configurations
            - rootReducer.js - 
            - middleware/ - middlewares for storage
        - styles/ - syles directory (deprecated in most cases). store here only variables for other style files.     
        
        - utils/ utilites methods 

    
    test-support/ - files for tests (included before run mocha)
    
    .babelrc - babel's config
    .editorconfig - base configuration for editor (not full)
    .eslintignore - rules for eslint to ignore files
    . eslintrc.yml - eslint config
    .flowconfig - flowconfig
    .gitignore - git's ignore-list
    .gulpfile - config for gulp (deprecated)
    .mailmap - git sub-configuration file
    .npmrc - npm config for project
    .sreporterrc - config for sonarqube's reporter
    Dockerfile - docker's container's makefile
    gulpfile - wrapper for .gulpfile
    Jenkinsfile - pipeline rules for buils system
    package.json - meta info about project
    postcss.config.js - postcss config
    README.md - this.file
    sonar-project.properties - config for sonarqube
    



# API usage

## Single call
Dispatching event with object with [CALL_API] key generates 1 API request.
Value of CALL_API key should be an object with fields.
Fields available:
 * `method` {String} - HTTP method (GET, POST, PUT, ...)
 * `path` {String} - HTTP url pathname (remember, that middleware append API_BASE_URL env before this pathname)
 * `query`  - *optional* - {Object} - query object
 * `body` - *optional* - {Object|String} - HTTP request's body.
 * `startType` - *optional* - {String|Symbol} - ActionType to dispatch before api call. Action object will be:
        ` { type: params.startType, url : params.url , query : params.query} ` There url is full url.
 * `beforeStart` - *optional* - {Function} - Function to call before api call.
 * `successType` - *optional* - {String|Symbol} - ActionType to dispatch on success api call. Action object will be:
        ` { type: params.successType, response : responseBody} `
 * `errorType` - *optional* - {String|Symbol} - ActionType to dispatch on error api call. Action object will be:
        ` { type: params.successType, error : anErrorObject} `
 * `afterSuccess` - *optional* - {Function} - Function to call then api call succeeds.
 * `afterError` - *optional* - {Function} - Function to call then api call errors.
 * `skipGlobalErrorHandler` - *optional* - {boolean} - `false` by default. If true global error handler will not be
        called.
 * `maxCount` - *optional* - {Number} - `1` by default. Count of maximum requires with this unifier in queue. See next.
 * `unifier` - *optional* - {String|Function} - by default for every method except GET it is unique string (to prevent
        breaking logic). Also for GET requests it is `${params.method} ${params.path} ${JSON.stringify(params.query)}`. 
        If it is Function it should return string that is unique request id. You may use it to prevent extra requests at
        dropdowns for example (set `maxCount=2, unifier='/path/to/api/without/search/part'`).


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




