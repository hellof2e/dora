import ee from 'event-emitter';
//@ts-ignore
import codegen from 'codegen.macro';
import useCtx from './useCtx';

const subDoraConfig: [] = codegen`
  module.exports = require('./doraPickSubDoraConfig.js');
`;


const MyClass = function () { /* .. */ };
ee(MyClass.prototype); // All instances of MyClass will expose event-emitter interface

const emitter = new MyClass();

function doraEventRegister(){
  //@ts-ignore
  subDoraConfig.forEach(({ event = {} } = {}) => {
    Object.keys(event).map((key: string) => {
      //@ts-ignore
      emitter.on(key, event[key]);
    });

  });
};

doraEventRegister();

export default {
  doraEventRegister : doraEventRegister,
  on : (eventName, fn ) => {
    emitter.on(eventName, fn);
  },
  once : (eventName, fn ) => {
    emitter.once(eventName, fn);
  },
  off : (eventName, listener) => {
    emitter.off(eventName, listener);
  },
  emit : ({ eventName, args = {} }) => {
    return emitter.emit(eventName, {
      useCtx,
      ...args
    });
  },
  emitter,
};