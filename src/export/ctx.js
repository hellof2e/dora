

let global = {};
if (typeof wx !== 'undefined') {
  global = wx;
} else if (typeof my !== 'undefined') {
  global = my;
}
 
const ctx = {
  use(key, module = {}) {
    global.ctx = global.ctx || {};
    if (global.ctx[key]) {
      // eslint-disable-next-line no-console
      console.warn(`[MPContext]${key}模块被覆盖。旧值:`, global.ctx[key], '新值:', module);
    }
    global.ctx[key] = module;
  },

  call(moduleId, methodName, ...args) {
    if (!global.ctx[moduleId]) {
      throw new Error(`模块：${moduleId} 不存在！`);
    }

    const module = global.ctx[moduleId];
    if (!methodName) {
      return module;
    }
    const method = module[methodName];
    if (typeof method === 'function') {
      return module[methodName](...args);
    }
    return method;
  },
};

module.exports = ctx;