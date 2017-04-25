const fs = require('fs');
const path = require('path');

const superagent = require('superagent');
const yaml = require('js-yaml');
const { camelizeKeys } = require('humps');
const { parseSchema } = require('json-schema-to-flow-type');


const swaggerUrl = require(path.join(__dirname, '../package.json')).swaggerUrl;

new Promise(getSwagger)
  .then(yamlToJson)
  .then(jsonToTypes);

function getSwagger(resolve) {
  superagent
    .get(swaggerUrl)
    .end((err, response) => {
      if (err) {
        throw err;
      }
      return resolve(response.text);
    });
}


function yamlToJson(text) {
  return Promise.resolve(camelizeKeys(yaml.safeLoad(text)));
}

function jsonToTypes(json) {
  const targetDir = path.join(__dirname, '../src/types');
  const imports = {};

  const data = Object
    .keys(json.definitions)
    .map((id) => {
      imports[id] = path.join(targetDir, `${id}.js.flow`);
      return id;
    })
    .map((id) => {
      const res = parseSchema(Object.assign({ id }, json.definitions[id]), imports);
      return [res, ''].join('\n');
    }).join('\n\n');

  const result = (
    ` /** @flow */

${data}
`
  );
  fs.writeFile(path.join(targetDir, 'index.js'), result);
}
