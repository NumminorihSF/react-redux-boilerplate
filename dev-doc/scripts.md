#npm scripts

All scripts in `package.json` starts with lodash aren't for manual usage. 
They are created only to avoid scripts' boilerplate.


## git hooks
### prepush
Prepush hooks run lints, flow checks and tests on repo, so push may be slow.
 
 
## install
### postinstall
Remove npm from .bin directory. (Avoid use npm v2 from anyproxy package).
### install:all
Force installs all dependencies (regular and development).
### install:production
Installs only regular dependencies.
### install:sonar (CI)
Installs packages needed for sonarqube reports.


## Sonar Qube
###sonar:report (CI)
Generates sonarqube report


## Linting JS
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


## Linting styles
### stylelint
Runs stylelint on src folder.
### stylelint:fix
Runs stylelint with `fix` flag. Appends comas, semicolons and do other things, that stylelint can do by itself.
### stylelint:changed
Runs stylelint on changed files (much faster on big project than `npm run stylelint`).
### stylelint:watch
Watches src folder. Runs stylelint on every changes at folder.
### stylelint:watch:changed
Watches src folder. Runs `stylelint:changed` on every changes at folder.
### stylelint:ci (CI)
Runs stylelint at CI


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


## Copy-paste detection
### copypaste:detect
Starts jscpd check.
### copypaste:detect:watch
Watches src folder. Runs `jscod` on every changes at folder.
### copypaste:detect:ci (CI)
Runs copy-paste detection on project at CI


## Building
There are some env variables, should be set to build application:
 - `API_BASE_URL` - url to API's root. For example `http://my-api.com`.
 By default it is `http://localhost:3001`.

### build
Builds production application.
### build:production
Builds dll and after builds production bundle. 
It is minified, has `NODE_ENV=production` and it builds slow source-maps.
### build:staging
Builds dll and after builds prodiction bundle.
It is not minified, has `NODE_ENV=staging` and it also builds slow source-maps.


## Development server
Development server use hot-module-replacement.
The recommended way for fast development is run `dev:server:fast` 
and run test, lint, flow and any other check in other threads.
### dev:server
Starts slow development server (slow because build start after linting and tests).
### dev:server:notest
Starts `dev:server` with skipping test. If you are using this, run test by yourself.
### dev:server:nolint
Starts `dev:server` with skipping lint. If you are using this, run lint by yourself.
### dev:server:nostylelint
Starts `dev:server` with skipping stylelint. If you are using this, run stylelint by yourself.
### dev:server:noflow
Starts `dev:server` with skipping flow. If you are using this, run flow checks by yourself.
### dev:server:fast
Starts `dev:server` with skipping all checks and test. If you are using this, run checks by yourself.


## Helping
You may share your current progress with other people via `help:me` script.
### help:me
Run dev:server in fast mode with enabled hot module replacement. 
It'l generate url (something like `https://qweasdzxc.localtunnel.me`) ang put it into 
console.
