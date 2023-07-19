const { run } = require('./shell');
const log = require('./log');
const { readPkJson } = require('./read');


const git = (...args)=>run('git', ...args);

async function getBranchName(path){
  const rootBranchName = await git('rev-parse --abbrev-ref HEAD', true, path);
  return rootBranchName;
}

async function checktIsNew(branch, path, checkMethod,){
  try {
    const result = await git(`ls-remote origin ${branch}`, true, path);
    const commitId = result? result.split(/\s/)[0]: undefined;
    if (!commitId) {
      console.log(result, branch, path, checkMethod,);
      throw new Error('获取远程仓库最新commitId时出错');
    }
    const containsBranch = await git(`branch --contains ${commitId}`, true, path);
    const branches = containsBranch?containsBranch.split(/\n|\r|\s/g): undefined;
    return branches? branches.some(checkMethod):undefined;
  } catch (error) {
    console.log(error);
    return false;
  }
}


async function dirtyCheck(branchName, path) {
  const status = await git('status -s', true, path);
  
  if (status) {
    log.err(branchName+'分支下存在未提交的代码');
  }
  if (!branchName.startsWith('release/')) {
    log.err(branchName+'不是release分支');
  }

  return false;
}


async function generateTag(currentBranch, path) {
  const pkJson = await readPkJson(path);
  const version = pkJson.version;
  const timestamp = Date.now();
  return `${version}-${currentBranch}-${timestamp}`;
}

module.exports = {
  git,
  getBranchName,
  checktIsNew,
  dirtyCheck,
  generateTag,
};