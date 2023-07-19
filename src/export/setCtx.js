
const ctx = require('./ctx');
const config = require('../utils/const');


const setCtx = (context) => {
  function useBaseCtx() {
    return context;
  }

  return ctx.use(config.__BASE_CTX_KEY__, { [config.__BASE_CTX_KEY__] : () => useBaseCtx });
};

module.exports = setCtx;

