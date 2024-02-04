const ErrorWrapper = require(`${process.env.COMMON_PATH}/error/ErrorWrapper`);
const BaseRoute = require(`${process.env.COMMON_PATH}/BaseRoute`);
const someController = require('./module/service-name/controller');

class RouteExpress extends BaseRoute {
  constructor(app) {
    try {
      super();
      this.initRoutes(app)
      this.initGateways(app)
    } catch (e) {
      throw new ErrorWrapper(e);
    }
  }

  initRoutes(app) {
    app.post('/some-route', this.runController(someController.Test));
  }

  initGateways(app) {
    app.post('/some-route', (req, res) => res.delegate('some-queue')) ;
  }
}
module.exports = (app) => new RouteExpress(app);