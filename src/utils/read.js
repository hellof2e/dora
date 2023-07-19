const { join } = require('path');
const { readFileSync } = require('fs');

async function readPkJson(path){
  const contentStr = readFileSync(join(path, 'package.json')).toString();
  const pkJson = JSON.parse(contentStr);
  return pkJson;
}

async function readJson(path, filename){
  const contentStr = readFileSync(join(path, filename)).toString();
  const json = JSON.parse(contentStr);
  return json;
}

module.exports = {
  readPkJson,
  readJson,
};