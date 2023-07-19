const { spawn } = require('child_process');

async function run(
  binary,
  command,
  collect = false,
  cwd = process.cwd()
){
  const args = [command];
  const options = {
    cwd, // 当前工作目录
    stdio: collect ? 'pipe' : 'ignore',
    shell: true,
  };
  return new Promise((resolve, reject) => {
    const child = spawn(`${binary}`, args, options);
    let error = null;
    if (collect) {
      child.stdout.on('data', data =>
        resolve(data.toString().replace(/\r\n|\n/, ''))
      );
    }
    if (child.stderr) {
      child.stderr.on('data', data => {
        error = (error || '') + data.toString().replace(/\r\n|\n/, '');
      }
      );
    }
    child.on('close', (code, signal) => {
      if (code === 0) {
        resolve(null);
      } else {
        console.log(
          binary,
          command,
          collect,
          cwd,
        );
        reject(new Error(error || String(signal) || String(code)));
      }
    });
  });
}

module.exports = {
  run
};