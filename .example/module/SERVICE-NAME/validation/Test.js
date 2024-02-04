const Validator = require(`${process.env.COMMON_PATH}/Validator`);
const Rule = require(`${process.env.COMMON_PATH}/Rule`);

class Test {
  static get field() {
    return {
      name: new Rule({
        validator: v => v.length <= 50,
        description: 'Invalid name field'
      }),
      password: new Rule({
        validator: v => v.length > 0,
        description: 'Invalid password field'
      }),
      someField: new Rule({
        validator: async(v) => await this.someRule(v),
        description: 'Invalid someField field'
      }),
    };
  }

  static someRule(v) {
    return new Promise(async (req, res) => {
      try {
        let result = typeof v === 'string' && v.length >= 1;
        return res(result);
      } catch (e) {
        return res(false);
      }
    })
  }
}

module.exports = Test;

