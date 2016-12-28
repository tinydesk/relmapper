const _ = require('lodash');
const mapper = {};

/**
 * Convert _ to camel case:
 */
mapper.case = {
  apply: o => _.mapKeys(o, (value, key) => key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)),
  unapply: o => _.mapKeys(o, (value, key) => key.replace(/([a-zA-Z])_([a-zA-Z])/g, (m, c1, c2) => `${c1}${c2.toUpperCase()}`))
};

mapper.flatten = delimiter => ({
  apply: o => {
    const result = {};
    const r = (path, o) => {
      if (_.isPlainObject(o)) {
        _.map(_.keys(o), key => r(path.concat(key), o[key]));
      } else {
        result[_.join(path, delimiter)] = o;
      }
    }
    r([], o);
    return result;
  },
  unapply: o => _.transform(o, (o, value, key) => _.set(o, key.replace(new RegExp(_.escapeRegExp(delimiter), 'g'), '.'), value), {})
});

mapper.sequence = (...pipeline) => ({
  apply: o => _.reduce(pipeline, (res, current) => current.apply(res), o),
  unapply: o => _.reduce(_.reverse(pipeline), (res, current) => current.unapply(res), o)
});

mapper.default = mapper.sequence(mapper.flatten('_'));

module.exports = mapper;