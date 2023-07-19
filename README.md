
# taro小程序微前端集成框架
dora是一个哈啰出行的开源的taro小程序微前端集成框架，具有把多页业务拆分并集成编译的与通讯的能力，解耦了业务与业务，降低了总体的复杂度与多业务线合作难度


## 集成编译
dora具有集成编译功能，app与在subapp中添加以下config既可以运行，会自动集成各业务线的路由, 可以参考demo仓库

## 事件通讯
dora使用事件通讯来解耦业务线与业务线之间的关系，在subapp的config中可以定义事件来监听整个app的运行周期与自定义事件
```
  componentDidShow () {
    doraEvent.emit({
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
dora使用ctx来桥接父与子仓库的通讯

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
### dora update
`dora update`
把所有subapp的版本切换为父应用中的版本
### dora publish
`dora publish`
把当前目录publish到父仓库中去，请确定你拥有父仓库与子仓库的push权限

## demo
https://github.com/hellof2e/doraAppExample 父应用demo
https://github.com/hellof2e/doraSubappExample 子应用demo


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
