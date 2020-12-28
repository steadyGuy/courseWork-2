const app = require('./app');
const config = require('./config');
const logger = require('./libs/logger');

const server = app.listen(config.port, config.host, () => {
  logger.info(`App is running on ${config.host}:${config.port}`);
});

