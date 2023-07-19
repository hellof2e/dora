const chalk = require('chalk');

const log = console.log;

module.exports = {
  err: (mess, exit = true)=>{
    log(chalk.red(mess));
    exit && process.exit(1);
  },
  info: (mess)=>{
    log(chalk.yellow(mess));
  },
  succ: (mess)=>{
    log(chalk.green(mess));
  },
};
