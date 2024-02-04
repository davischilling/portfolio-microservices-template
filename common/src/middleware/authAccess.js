const errorCodes = require('../error/errorCodes');
const ErrorWrapper = require('../error/ErrorWrapper');
const roles = require('../roles');
const { Redis } = require('../RootProvider');

module.exports = async (req) => {
  const token = req.headers['x-auth-token'];
  let user = {email: null, role: roles.anonymous}
  if (!token) {
    req.authorization = Object.freeze(user);
    return;
  };
  user = await Redis.get(token, true);
  if (!user) throw new ErrorWrapper({ ...errorCodes.TOKEN_EXPIRED });
  req.authorization = Object.freeze(user);
  return req.authorization;
}