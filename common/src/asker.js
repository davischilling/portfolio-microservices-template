let MicroMQ = require('micromq');

module.exports = async(service='logger', action='create', meta={}) => {
  try {
    meta.service = process.env.SERVICE_NAME;
    meta.secret = process.env.SECRET;
    /* Not use MicroMQ.ask() from RootProvider (will be "channel closed error") */
    return new MicroMQ({
      name: process.env.SERVICE_NAME,
      microservices: process.env.MICROMQ_ACTION.split(','),
      rabbit: {
        url: process.env.RABBIT_URL
      }
    }).ask(service, { server: { action, meta } });
  } catch (e) {
    console.log(e);
  }
}