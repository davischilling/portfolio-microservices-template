const BaseRoute = require(`${process.env.COMMON_PATH}/BaseRoute`);
const ErrorWrapper = require(`${process.env.COMMON_PATH}/error/ErrorWrapper`);
const npmUpdater = require(`${process.env.COMMON_PATH}/action/npm-updater`);
const { Micromq } = require(`${process.env.COMMON_PATH}/RootProvider`);
const someController = require('./module/some/controller');

class RouteMicromq extends BaseRoute {
  constructor() {
    try {
      super();
      this.app = Micromq;
      this.initRoutes()
      this.initActions()
      this.app.start();
      require(`${process.env.COMMON_PATH}/Logger`).init(`${process.env.SERVICE_NAME} micro service listening on ${process.env.HOST}:${process.env.PORT}.`);
    } catch (e) {
      throw new ErrorWrapper(e);
    }
  }

  /*
    From RouteExpress - initGateways (REST)
  */
  initRoutes(app) {
    this.app.post('/some/route', this.runController(someController.Create));
  }

  /*
    From Service - asker (RPC)
  */
  initActions(app) {
    this.app.action('/some-action', this.runAction(npmUpdater));
  }
}
module.exports = () => new RouteMicromq();