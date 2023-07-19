
const ctx = require('./ctx');
const config = require('../utils/const');


const useCtx = () => {
  return ctx.call(config.__BASE_CTX_KEY__, config.__BASE_CTX_KEY__)() || {};
};

module.exports = useCtx; 