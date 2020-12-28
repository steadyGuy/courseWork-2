const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, 'production.env'),
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const DOMAIN = process.env.DOMAIN || `http://${HOST}${PORT !== 80 ? ':' + PORT : ''}`;

module.exports = {
  port: PORT,
  host: HOST,
  domain: DOMAIN,
  // mongodb: {
  //   uri: (process.env.NODE_ENV === 'test')
  //     ? 'mongodb://localhost/any-shop-test'
  //     : process.env.MONGODB_URI || 'mongodb://localhost/any-shop',
  // },
  logger: {
    level: (process.env.NODE_ENV !== 'production' ? 'verbose' : 'info'),
  },
};
