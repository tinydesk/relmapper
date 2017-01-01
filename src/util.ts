import * as _ from 'lodash';
import {JsonNonPrimitive, JsonObject} from "./types";

export const mapArrayOrObject = (o: JsonNonPrimitive, fn: (o: JsonObject) => JsonObject) => _.isArray(o) ? _.map(o, fn) : fn(o);