import * as _ from 'lodash';
import {mapArrayOrObject} from "./util";
import {Mapper, JsonObject, JsonNonPrimitive} from "./types";

/**
 * Creates a mapper out of a partial mapper that can only map objects.
 *
 * @param m An object with properties `apply` and `unapply` that only map single objects.
 * @returns A mapper that can also map arrays.
 */
export const fromObjectMapper = (m: Mapper<JsonObject>) => ({
  apply: (o: JsonNonPrimitive) => mapArrayOrObject(o, m.apply),
  unapply: (o: JsonNonPrimitive) => mapArrayOrObject(o, m.unapply)
});

export const sequence = (...pipeline: Mapper<JsonNonPrimitive>[]) => ({
  apply: (o: JsonNonPrimitive) => _.reduce(pipeline, (res, current) => current.apply(res), o),
  unapply: (o: JsonNonPrimitive) => _.reduceRight(pipeline, (res, current) => current.unapply(res), o)
});