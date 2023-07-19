#! /usr/bin/env node

const commander = require('commander');
const publish = require('./commands/publish');
const update = require('./commands/update');
const packageJson = require('../package.json');
const log = require('./utils/log');
const program = new commander.Command();

program
  .command('publish')
  .description('发布子应用代码至父应用')
  .action(() => {
    log.info('执行publish');
    publish();
  });

program
  .command('update')
  .option('-s, --specify <subAppName...>', '指定更新子模块')
  .description('更新子应用')
  .action((...args) => {
    // console.log(...args);
    update(...args);
  });

program.version(packageJson.version);
program.parse(process.argv);