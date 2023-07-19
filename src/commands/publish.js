const { git, dirtyCheck, generateTag } = require('../utils/git');
const getEnv = require('../utils/getPublishEnv');
const log = require('../utils/log');
const { join } = require('path');
const fs = require('fs');
const { CONFIG_FILE_NAME } = require('../utils/const');
const { readPkJson } = require('../utils/read');

module.exports = async function publish() {
  const {
    rootPath,
    rootBranchName,
    rootIsNew,
    currHasMaster,
    currBranchPath,
    currBranchName,
  } = await getEnv();

  const subAppPkJson = await readPkJson(currBranchPath);
  const vcConfig = require(join(rootPath, CONFIG_FILE_NAME));

  log.info('当前子应用'+subAppPkJson.subAppName);

  if (!rootBranchName.startsWith('release/')) {
    log.err('请把父仓库切到release/分支');
  }

  try {
    await git('fetch --all', false, rootPath);
    log.succ('仓库fetch成功');
  } catch (error) {
    log.err('在父仓库执行fetch --all报错，请检查你是否有父仓库的拉取权限');
  }

  if (!rootIsNew) {
    log.err(`请先更新${rootBranchName}到最新的提交,再运行publish`);
  }

  if(!currHasMaster){
    log.err('当前分支不包含master分支的内容，请更新master分支的提交到当前分支');
  }

  try {
    await dirtyCheck(currBranchName, currBranchPath);
    log.succ('仓库通过校验');
  } catch (error) {
    log.err(`操作失败，${error.message || '-'}`);
  }

  const tag = await generateTag(currBranchName, currBranchPath);

  await git(`tag -a ${tag} -m '${subAppPkJson.subAppName}发布'`, false, currBranchPath);
  log.succ(`分支 ${currBranchName} 创建tag ${tag} 成功`);
  
  try {
    git(`push origin ${currBranchName} --tags`, false, currBranchPath);
    log.succ(`push tag ${tag} 成功`);
  } catch (error) {
    const message = `请检查:
    1.${currBranchName}是否是最新的
    2.你是否有子应用仓库的push权限` +
    '\n确认可以push后，请再次运行publish命令';
    log.info(message);
    log.err(`在${subAppPkJson.subAppName}仓库中push操作报错`);
  }
  
  const currAppConfig = Object.values(vcConfig.apps).find(({
    subAppName
  })=>{
    return subAppName === subAppPkJson.subAppName;
  });
  
  if(!currAppConfig){
    log.err(`${CONFIG_FILE_NAME}中未找到subAppName名为${subAppPkJson.subAppName}的配置`);
  }
  
  currAppConfig.tag = tag;
  
  const newVcConfig = JSON.stringify(vcConfig, null, 2);

  fs.writeFileSync(join(rootPath, CONFIG_FILE_NAME), newVcConfig); 
  log.succ(`父仓库${CONFIG_FILE_NAME}tag配置修改成功`);

  await git(`add ${CONFIG_FILE_NAME}`, false, rootPath);

  const stageFiles = (await git('diff --name-only --cached', true, rootPath) || '');
  const fileReg = new RegExp(`^${CONFIG_FILE_NAME}$`);
  if (!fileReg.test(stageFiles)) {
    const errorMsg = `父仓库提交的文件应只有${CONFIG_FILE_NAME}
    1.父仓库里运行git status
    2.查看是否只有${CONFIG_FILE_NAME}在暂存区待提交
    3.将${CONFIG_FILE_NAME}之外的文件移出暂存区后再次运行publish命令`;
    log.err(errorMsg);
  }
  await git(`commit -nm "feat(更新业务依赖): ${subAppPkJson.subAppName}依赖更新到tag:${tag}"`, false, rootPath);

  try {
    const pushCommand = ['push', 'origin', `${rootBranchName}:${rootBranchName}`];
    await git(pushCommand.join(' '), true, rootPath);
    log.succ('父仓库push成功');
  } catch (error) {
    const message = `请检查:
    1.父仓库是否是最新的
    2.你是否有父仓库的push权限` +
    '\n确认可以push后，请再次运行publish来发布';
    log.info(message);
    log.err('在父仓库中push操作报错');
  }

  log.succ(`publish成功`);
};