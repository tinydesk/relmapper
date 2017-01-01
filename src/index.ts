import {sequence} from "./combine";
import {flatten, camelCase} from "./name";
import {JsonNonPrimitive, Mapper} from "./types";

export * from './combine';
export * from './types';
export * from './name';
export * from './util';

export const defaultMapper: Mapper<JsonNonPrimitive> = sequence(flatten('__'), camelCase);