const fs = require('fs');
const findUp = require('find-up');
const { join } = require('path');

const configPath = findUp.sync('config.json');
const doraConfig = require(configPath);
const { apps } = doraConfig;

const pathArr = [];
Object.values(apps).forEach(({ configPath: subConfigPathStr }) => {
  const subConfigPath = join(process.cwd(), subConfigPathStr);

  if (fs.existsSync(subConfigPath)) {
    pathArr.push(subConfigPath);
  }
});
module.exports = '[' + pathArr.map(l => 'require(' + JSON.stringify(l) + ')') + ']';