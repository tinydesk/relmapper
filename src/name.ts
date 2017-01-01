import * as _ from 'lodash';
import {fromObjectMapper} from "./combine";
import {JsonObject} from "./types";

/**
 * Convert _ to camel case:
 */
export const camelCase = fromObjectMapper({
  apply: o => _.mapKeys(o, (value, key) => key.replace(/[A-Z]/g, (c: string) => `_${c.toLowerCase()}`)),
  unapply: o => _.mapKeys(o, (value, key) => key.replace(/([a-zA-Z])_([a-zA-Z])/g, (m: string, c1: string, c2: string) => `${c1}${c2.toUpperCase()}`))
});

export const flatten = (delimiter: string) => fromObjectMapper({
  apply: o => {
    const result: JsonObject = {};
    const r = (path: string[], o: any) => {
      if (_.isPlainObject(o)) {
        _.map(_.keys(o), key => r(path.concat(key), o[key]));
      } else {
        result[_.join(path, delimiter)] = o;
      }
    }
    r([], o);
    return result;
  },
  unapply: o => _.transform(o, (o, value, key) => _.set(o, key.replace(new RegExp(_.escapeRegExp(delimiter), 'g'), '.'), value), <JsonObject>{} )
});