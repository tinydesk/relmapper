const _ = require('lodash');
const mapper = {};

/**
 * Convert _ to camel case:
 */
mapper.case = {
  apply: o => _.mapKeys(o, (value, key) => key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)),
  unapply: o => _.mapKeys(o, (value, key) => key.replace(/_./g, c => `${c[1].toUpperCase()}`))
};

mapper.flatten = {
  apply: o => {
    const result = {};
    const r = (path, o) => {
      if (_.isObject(o)) {
        _.forEach(o, (value, key) => r(path.concat(key), value));
      } else {
        result[_.join(path, '.')] = o;
      }
    }
    r([], o);
    return result;
  },
  unapply: o => _.transform(o, (o, value, key) => _.set(o, key, value), {})
};

mapper.sequence = (...pipeline) => ({
  apply: o => _.reduce(pipeline, (res, current) => current.apply(res), o),
  unapply: o => _.reduce(_.reverse(pipeline), (res, current) => current.unapply(res), o)
});

mapper.default = mapper.sequence(mapper.flatten);

module.exports = mapper;