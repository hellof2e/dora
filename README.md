
<p align="center">
  <a href="https://ant.design">
    <image src='./docs/圆角-tmpq_5tz_14.png' width='200px' />
  </a>
</p>

<h1 align="center">Dora</h1>

# Taro小程序微前端集成框架
Dora是一个哈啰出行的开源的Taro小程序微前端集成框架，具有把多页业务拆分并集成编译的与通讯的能力，解耦了业务与业务，降低了总体的复杂度与多业务线合作难度


## 集成编译
Dora具有集成编译功能，app与在subapp中添加以下config既可以运行，会自动集成各业务线的路由, 可以参考demo仓库

## 事件通讯
Dora使用事件通讯来解耦业务线与业务线之间的关系，在subapp的config中可以定义事件来监听整个app的运行周期与自定义事件
```
  componentDidShow () {
    DoraEvent.emit({
      eventName : 'app:componentDidShow',
      args : {},
    });
  }
```
```
  event : {
    'app:componentDidShow' : (arg) => {
      console.log('subapp 启动');
      console.log('持续检测用户当前订单是否偏离导航，触发安全机制。');
    },
    'app:componentDidHide' : (arg) => {
      console.log('subapp 启动');
      console.log('推入后台暂停检测');
    },
  },
```
在小程序componentDidShow时候就会打印
<image src='./docs/event.png' >

## 子父通讯与桥接
Dora使用ctx来桥接父与子仓库的通讯

### setCtx
```
import useCtx from '../../../../../src/export/useCtx';

setCtx({
  moduleA: ()=>{
    return '我来自父app'
  }
})
```

### useCtx
```
<View className='index'>
  我是subapp的页面
  <View >
    {useCtx().moduleA()}
  </View>
</View>
```

## 版本控制
### Dora update
`Dora update`
把所有subapp的版本切换为父应用中的版本
### Dora publish
`Dora publish`
把当前目录publish到父仓库中去，请确定你拥有父仓库与子仓库的push权限

## demo
https://github.com/hellof2e/DoraAppExample 父应用demo
https://github.com/hellof2e/DoraSubappExample 子应用demo



# 如何使用
## 安装
$ npm i -g  @hellobikefe/dora


## 指令
```
命令
Options:
  -V, --version     output the version number
  -h, --help        display help for command
Commands:
  publish           发布子应用代码至父应用
  update [options]  更新子应用
  help [command]    display help for command
```

## 接入
### config.json & config.ts/js
配置config.json在父应用与子应用中，子应用包含路由和event，父config记录子应用tag path等。在项目初始化的时候可以手动clone子仓库到想要的目录，随后在子应用根目录执行dora publish
```
//父亲仓库config.json
{
  "apps": {
    "doraSubappExample": {
      "configPath": "./src/doraSubappExample/config.ts",
      "path": "./src",
      "repository": "git@github.com:gjc9620/dora-subapp-example.git",
      "subAppName": "doraSubappExample", 
      "tag": "1.0.0-release/1.0.0-1689675708545"
    }
  }
}
```
子仓库可以参考 此[配置](https://github.com/hellof2e/doraAppExample/blob/23df5ef592b8c9dab8fa19d15f76ed516fd263fb/src/app.config.ts#L38)

## package.json
在接入的子仓库的package.json中编写subappname属性
```
{
  "version": "1.0.0",
  "subAppName": "doraSubappExample"
}
```

## babel
增加babel插件 执行npm i babel-plugin-macros@3.1.0，随后在config/index中添加如下代码
```
const macros = (chain) => chain.merge({
  module : {
    rule : {
      myloader : {
        test : /(node_modules|src).*\.(ts|tsx|js|jsx)$/,
        use : [{
          loader : 'babel-loader',
          options : {
            plugins : [
              'macros',
            ],
          },
        }],
      },
    },
  },
});

//增加
webpackChain(chain) {
  macros(chain)
},
```

这里配置就完成了
具体可以参考这2个仓库
父应用demo(https://github.com/hellof2e/doraAppExample)   <br/>
子应用demo(https://github.com/hellof2e/doraSubappExample)