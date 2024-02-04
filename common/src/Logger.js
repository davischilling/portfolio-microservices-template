const pino = require('pino');
const pretty = require('pino-pretty');
const ask = require('./asker');

const stream = pretty({
  colorize: true
})
const logger = pino(stream);

class Logger {
  async error(m){
    Promise.all([logger.error(m), this.save('error', m)])
  }
  async warning(m){
    Promise.all([logger.warn(m), this.save('warning', m)])
  }
  async info(m){
    Promise.all([logger.info(m), this.save('info', m)])
  }
  async fatal(m){
    Promise.all([logger.fatal(m), this.save('fatal', m)])
  }
  async update(m){
    Promise.all([logger.info(m), this.save('update', m)])
  }
  async init(m){
    Promise.all([logger.info(m), this.save('init', m)])
  }
  async save(category, message){
    if (typeof message !== 'string') message = JSON.stringify(message);
    await ask('logger', 'create', {category, message})
  }
}

module.exports = new Logger();