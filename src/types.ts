
export interface Mapper<T extends JsonValue> {
  apply(json: T): T,
  unapply(rows: T): T
};

export type JsonPrimitive = number|string|boolean;
export type JsonNonPrimitive = JsonObject|JsonArray;
export type JsonValue = JsonPrimitive|JsonNonPrimitive;
export type JsonObject = { [key: string]: JsonValue }
export type JsonArray = (JsonPrimitive|JsonObject)[];