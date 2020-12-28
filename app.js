const path = require('path');
const Koa = require('koa');
const config = require('./config');
const cors = require('@koa/cors');

const app = new Koa();

app.use(require('koa-bodyparser')())
  .use(require('koa-static')(path.join(__dirname, 'public')))
  .use(require('./middlewares/error'))
  .use(cors())
  .use(require('./router').routes());

module.exports = app;
