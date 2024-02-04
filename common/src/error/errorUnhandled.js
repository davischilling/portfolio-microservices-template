const log = require('../Logger');

module.exports = () => {
  process.on('unhandledRejection', async (reason, promisse) => {
    log.error(`==unhandledRejection== | ${reason}`);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  });
  process.on('rejectionHandled', async (promisse) => {
    log.error(`==rejectionHandled==`);
  });
  process.on('multipleResolves', async (type, promisse, reason) => {
    log.error(`==multipleResolves== ${reason}`);
  });
  process.on('uncaughtException', async (err) => {
    log.fatal(`==uncaughtException== ${err}`);
    setTimeout(() => {
      process.exit(1);
    }, 2000);
  });
}