const { getBranchName, checktIsNew, dirtyCheck } = require('./git');
const { join } = require('path');
const log = require('./log');
const { CONFIG_FILE_NAME } = require('./const');
const findUp = require('find-up');


async function getPublishEnv() {
  const vcPath = findUp.sync(CONFIG_FILE_NAME);
  const rootPath = join(vcPath, '..');

  if(!rootPath){
    log.err(`未找到${CONFIG_FILE_NAME}`);
  }

  const env = {
    rootPath: rootPath,
    currBranchPath: process.cwd(),
  };

  env.rootBranchName = await getBranchName(env.rootPath);
  
  env.rootIsNew = await checktIsNew(
    env.rootBranchName,
    env.rootPath,
    b => (b === env.rootBranchName)
  );

  env.currBranchName = await getBranchName(env.currBranchPath);
    
  env.currHasMaster = await checktIsNew(
    'master',
    env.currBranchPath,
    b => (b === env.currBranchName)
  );
    
  env.currIsDirty = await dirtyCheck(env.currBranchName, env.currBranchPath);
    
  log.info(`父应用分支：`+env.rootBranchName);
  log.info(`当前子应用分支：`+env.currBranchName);

  return env;
}
 

module.exports = getPublishEnv;