const errorCodes = require('../error/errorCodes');
const ErrorWrapper = require('../error/ErrorWrapper');
const Assert = require('../assert');

/*
  @description check permissions to action by access tag
  @case uses in each action class
*/

module.exports = async (roleAllowed, role) => {
  Assert.array(roleAllowed, { required: true });
  Assert.string(role, { required: true });

  if (roleAllowed.includes('all')) return;
  if (roleAllowed.includes(role)) return;
  throw new ErrorWrapper({ ...errorCodes.ACCESS, message: 'Access denied, don\'t have permissions'});  
}