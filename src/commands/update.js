const fs = require('fs');
const { CONFIG_FILE_NAME } = require('../utils/const');
const { join } = require('path');
const log = require('../utils/log');
const { 
  git, 
  // getBranchName,
} = require('../utils/git');

async function checkoutTag(path, subApp) {
  const { tag, subAppName } = subApp;
  const status = await git('status -s', true, path);
  // const branchName = await getBranchName(path);

  if (status) {
    log.err('子仓库'+subAppName+'存在未提交的代码 ');
  }

  await git('fetch origin --prune', true, path);
  await git(`checkout ${tag}`, true, path);
}

module.exports = async function update(...args) {
  const [
    options
  ] = args;
  
  const specifySubAppName = options.specify;

  const currPath = process.cwd();
  const isInBaseRoot = fs.existsSync(join(currPath, CONFIG_FILE_NAME));
  
  if(!isInBaseRoot){
    log.err(`该目录下没有找到${CONFIG_FILE_NAME}, 请在base仓库运行update`);
  }
  log.succ('仓库解析成功');

  const {
    apps = {},
  } = require(join(currPath, CONFIG_FILE_NAME));

  for (const key of Object.keys(apps)) {
    const subApp = apps[key];
    const folderName = key;
    const { subAppName, path, repository, tag } = subApp;

    if(!subAppName || !tag) continue;

    try {
      if (subApp) {
        log.info(`同步${subAppName}子仓库`);
        const subAppPath = join(currPath, path, folderName);
        const subAppGitPath = `${subAppPath}/.git`;
        
        if (fs.existsSync(subAppPath) && fs.existsSync(subAppGitPath)) {
          if(specifySubAppName && !specifySubAppName.includes(subAppName)){
            log.info(`指定了subAppName: ${subAppName}更新被跳过`);
            continue;
          }
          await git('fetch --all', false, subAppPath);
          await checkoutTag(subAppPath, subApp);
          log.succ(`同步${subAppName}子仓库成功`);
        } else {
          log.info(`未找到${subAppName}目录， 开始clone..`);
          await git(
            `clone -b ${subApp.tag} ${repository} ${subAppPath}`,
            true,
            currPath
          );
          log.succ(`clone ${subAppName}子仓库成功`);
        }
      }
    } catch (error) {
      log.err(`同步${subAppName}子仓库失败：${error && error.message ? error.message : '未知原因'}`);
      process.exit(1);
    }
  }
};