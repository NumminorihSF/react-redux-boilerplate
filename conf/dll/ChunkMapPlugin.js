import fs from 'fs';
import path from 'path';

const pack = require('../../package.json');
const { buildDestination: dest } = pack;

const removeExt = function (name) {
  return name.replace(/\..*?$/, '');
};

export default class {
  constructor() {
    return function() {
      this.plugin("done", function (stats) {
        let json = {};
        stats.compilation.chunks.forEach(function (chunk) {
          chunk.files.forEach((file) => {
            json[chunk.name] = removeExt(file);
            json[chunk.id] = removeExt(file);
            chunk.ids.forEach((id) => {
              json[id] = removeExt(file)
            });
          });
        });
        fs.writeFile(path.join(process.cwd(), dest, 'dll', 'chunk-map.json'), JSON.stringify(json, null, 2));
      });
    }
  }
}
