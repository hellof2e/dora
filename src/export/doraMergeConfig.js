const { join } = require('path');
const cloneDeep = require('clone-deep');


const nodeRequire = (str) => {
  return eval('require')(str);
};

const fs = nodeRequire('fs');

const findUp = nodeRequire('find-up');

const compileSubAppNamesStr = (process.env.COMPILE_SUB_APP_NAMES || '');
const compileSubAppNames = compileSubAppNamesStr.split(',');
const isIncludeAll = !compileSubAppNamesStr;

function doraMergeConfig(config) {
  const configPath = findUp.sync('config.json');
  const doraConfig = nodeRequire(configPath);
  const { apps } = doraConfig;

  const appConfig = {
    pages: [],
    subPackages: [],
    ...cloneDeep(config)
  };
  Object.values(apps).forEach(({ configPath: subConfigPathStr, subAppName }) => {
    if(!isIncludeAll && !compileSubAppNames.includes(subAppName)){
      return;
    }

    const subConfigPath = join(process.cwd(), subConfigPathStr);

    if (fs.existsSync(subConfigPath)) {
      // const { pages = [], subPackages = [] } = require(`${subConfigPath}`) || {};
      const { pages = [], subPackages = [] } = nodeRequire(subConfigPath) || {};
      appConfig.pages.push(...pages);
      appConfig.subPackages.push(...subPackages);
    }
  });

  if (appConfig.pages.length < 1) delete appConfig.pages;
  if (appConfig.subPackages.length < 1) delete appConfig.subPackages; 

  return appConfig;
}


module.exports = doraMergeConfig;