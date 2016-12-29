const _ = require('lodash');
const mapper = {};

const mapArrayOrObject = (o, fn) => _.isArray(o) ? _.map(o, fn) : fn(o);

/**
 * Creates a mapper out of a partial mapper that can only map objects.
 *
 * @param m An object with properties `apply` and `unapply` that only map single objects.
 * @returns A mapper that can also map arrays.
 */
mapper.fromObjectMapper = m => ({
  apply: o => mapArrayOrObject(o, m.apply),
  unapply: o => mapArrayOrObject(o, m.unapply)
});

/**
 * Convert _ to camel case:
 */
mapper.case = mapper.fromObjectMapper({
  apply: o => _.mapKeys(o, (value, key) => key.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`)),
  unapply: o => _.mapKeys(o, (value, key) => key.replace(/([a-zA-Z])_([a-zA-Z])/g, (m, c1, c2) => `${c1}${c2.toUpperCase()}`))
});

mapper.flatten = delimiter => mapper.fromObjectMapper({
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
  unapply: o => _.reduceRight(pipeline, (res, current) => current.unapply(res), o)
});

mapper.default = mapper.sequence(mapper.flatten('__'), mapper.case);

module.exports = mapper;