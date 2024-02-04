const RequestRule = require(`${process.env.COMMON_PATH}/RequestRule`);
const ErrorWrapper = require(`${process.env.COMMON_PATH}/error/ErrorWrapper`);
const roles = require(`${process.env.COMMON_PATH}/roles`);
const ask = require(`${process.env.COMMON_PATH}/asker`);
const redis = require(`${process.env.COMMON_PATH}/client/redis`);
const TestValidation = require('../validation/Test');
const someService = require('../service/test');

class Test {

  // validate request fields
  static get validationRules () {
    return {
      query: {
        name: new RequestRule([TestValidation.field.name, TestValidation.field.someField], { required: false }),
      },
      // OR || AND
      // body: {
      //   name: new RequestRule([TestValidation.field.name], { required: true, allowed: ['allowedName'] }),
      // },
      // OR || AND
      // params: {
      //   name: new RequestRule([TestValidation.field.name], { required: false, allowed: ['allowedName2'] }),
      // },
    }
  }

  // check role access
  static roleAllowed () {
    // return [roles.all, roles.user, roles.anonymous]; examples
    return [roles.all];
  }

  static async run (req, res) {
    // get user auth
    let user = req.authorization;

    // get user data query
    let data = req.query;

    try {
      // call service
      await someService.someLogic(1);
      // create cache object
      let Redis = await redis();
      // Set cache value
      await Redis.set('Time', Date.now());
      // Get cache value
      await Redis.get('Time');
      // Send data to some service (RPC)
      await ask('nameService', 'actionService', { data: 'data is not required' });
      // Send response to client
      return res.status(200).json({
        success: true,
        message: 'Some Test controller',
        status: 200,
        data: {
          name: req.query.name,
        }
      });
    } catch (e) {
      throw new ErrorWrapper(e);
    }
  }
}

module.exports = Test;
