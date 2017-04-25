import fs from 'fs';
import path from 'path';

const { buildDestination: dest } = require('../../package.json');

const getExt = function(name){
  return name.match(/\..*?$/)[0];
};

export default class ClientChunkMapPlugin {
  constructor(){
    return function(){
      this.plugin("done", function(stats) {
        let json = {};
        stats.compilation.chunks.forEach(function(chunk){
          chunk.files.forEach((file)=>{
            json[chunk.name + getExt(file)] = file;
            json[chunk.id + getExt(file)] = file;
            chunk.ids.forEach((id)=>{json[id + getExt(file)] = file});
          });
        });
        fs.writeFile(path.join(process.cwd(), dest, 'chunk-map.json'), JSON.stringify(json, null, 2));
      });
    }
  }
}
