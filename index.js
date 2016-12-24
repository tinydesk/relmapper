const _ = require('lodash');
const mapper = {};

/**
 * Convert _ to camel case:
 */
mapper.case = {
  apply: o => _.mapKeys(o, (value, key) => _.snakeCase(key)),
  unapply: o => _.mapKeys(o, (value, key) => _.camelCase(key))
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

module.exports = mapper;