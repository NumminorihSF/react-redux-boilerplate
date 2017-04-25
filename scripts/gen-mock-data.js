import fs from 'fs';
import path from 'path';
import faker from 'faker';
import jsonFaker from 'json-schema-faker';


import * as schemas from '../src/data/schemas';

const seed = Number(process.env.FAKER_SEED) || 0;

faker.seed(seed);

const json = {};

const generateData = (name, schema, count) => {
  const modelName = name.toLowerCase();
  json[modelName] = json[modelName] || [];
  for(let i = 0; i < count; i += 1){
    const entity = jsonFaker(schema);
    Object.keys(schema.properties).forEach(key => {
      if (!(key in entity)) entity[key] = null;
    });
    json[modelName].push(entity);
  }
  json[modelName].sort((entityA, entityB) => entityA.id - entityB.id);
};

const writeData = (filePath) => {
  fs.mkdir(path.dirname(filePath), (err) => {
    if (err.code !== 'EEXIST') {
      throw err;
    }
    fs.writeFile(filePath, JSON.stringify(json, null, 2));
  });
};

Object.keys(schemas).forEach(modelName => {
  const tmpSchema = schemas[modelName]();
  const schema = {
    ...tmpSchema,
    required: []
  };
  Object
    .keys(tmpSchema.properties)
    .forEach((field) => {
      if (tmpSchema.properties[field].required) {
        schema.required.push(field);
      }
    });

  generateData(modelName, schema, 100);
});

writeData(path.resolve(process.cwd(), './tmp/fake-db.json'));
