# Environment


## Scripts
| Name              | Description                                                          | Default value |
|-------------------|----------------------------------------------------------------------|---------------|
| SLEEP             | used to add make some wait before run any check                      | `0`           |
| SKIP_PREPUSH      | used to skip prepush hook (only for help with some problems in code) |               |
| NODE_SKIP_%CHECK% | used to skip check in `dev:server`                                   |               |
| EXTRA_URL_%NAME%  | any count of extra urls to use with api                              |               |


## Runtime
There are some env variables used in project's runtime.

| Name             | Description                                           | Default value             |
|------------------|-------------------------------------------------------|---------------------------|
| NODE_ENV         | current build type                                    |                           |
| BING_API_KEY     | api key for using bing maps' api                      |                           |
| API_BASE_URL     | base url there api is available                       | `'http://localhost:3001'` |
| EXTRA_URL_%NAME% | any count of extra urls to use with api               |                           |


## Build
| Name             | Description                                           | Default value             |
|------------------|-------------------------------------------------------|---------------------------|
| NODE_ENV         | current build type (prod is minified)                 |                           |
| BABEL_ENV        | used for enable another babel's preset                | NODE_ENV's value          |
| TCOMB            | if is set dev:server will use runtime type checks     |                           |
