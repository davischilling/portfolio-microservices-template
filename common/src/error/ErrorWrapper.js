class ErrorWrapper extends Error {
  constructor(options) {
    super();
    if (!options?.message) throw new Error('ErrorWrapper: message param is required');
    this.message = options.message;
    this.status = options.status || 500;
    this.code = options.code || 'SERVER_ERROR';
    this.layer = options.layer || undefined;
    this.meta = options.meta || undefined;
    this.req = options.req || undefined;
    require('../Logger').warning(options.message);
  }
}

module.exports = ErrorWrapper;