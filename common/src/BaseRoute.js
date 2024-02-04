const errorCodes = require('./error/errorCodes');
const ErrorWrapper = require('./error/ErrorWrapper');
const errorUnhandled = require('./error/errorUnhandled');
const RequestRule = require('./RequestRule');
const Assert = require('./assert');
const authAccess = require('./middleware/authAccess');
const roleAccess = require('./middleware/roleAccess');

class BaseRoute {
  constructor() {
    /*
      catch all uncaught errors
    */
    errorUnhandled();
  }

  runController (controller) {
    Assert.func(controller, { required: true });
    if (!controller.hasOwnProperty('validationRules')) {
      throw new ErrorWrapper({ ...errorCodes.VALIDATION, message: `'validationRules' method not declared in invoked ${''}` });
    }
    if (!controller.hasOwnProperty('run')) {
      throw new ErrorWrapper({ ...errorCodes.VALIDATION, message: `'run' method not declared in invoked ${''}` });
    }
    if (!controller.hasOwnProperty('roleAllowed')) {
      throw new ErrorWrapper({ ...errorCodes.VALIDATION, message: `'roleAllowed' method not declared in invoked ${''}` });
    }
    return async (req, res, next) => {
      Assert.object(req, { required: true });
      Assert.object(res, { required: true });
      Assert.func(next, { required: true });
      try {
        /*
          check auth access
        */
       await authAccess(req);

        /*
          check role access
        */
        await roleAccess(controller.roleAllowed(), req.authorization.role);

        /*
          validate controller input data
        */
       if (controller.validationRules) {
        for (let d of object.keys(controller.validationRules)) {
          await validateSchema(req[d], controller.validationRules[d], d);
        }
       }
      } catch (e) {
        return next(e);
      }
    }
  }
}