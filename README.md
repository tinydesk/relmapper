# relmapper

Map a relational model to JSON and back.

This library is a light-weight tool, that is only concerned with converting between a hierarchical representation and a flat column-like representation of the data. The idea behind this is, that a server is essentially an adapter transforming data from a database to a web based interface such as REST over HTTP and vice versa. relmapper facilitates this transformation while not interfering with your queries. This library is for all developers that have decided on a particular relational db technology and want to leverage its full potential without being limited by the abstraction of an ORM. 

Support for transforming join results into arrays is planned but not yet implemented.

## Getting started

```bash
npm install relmapper --save
```

Convert json to a db record:
```javascript
var mapper = require('relmapper').default;
var json = {
  myJsonProperty: 5,
  myNested: {
    jsonProperty: 'with text'
  }
};
mapper.apply(json);
/*
returns {
  my_json_property: 5,
  my_nested__json_property: 'with_text'
}
 */
```

Convert the result from a db query to nested json from a table looking like this:
```sql
CREATE TABLE(
  my_json_property: INTEGER,
  my_nested__json_property: VARCHAR(512)
);
```

```javascript
var queryResult = query('SELECT * FROM mytable');
mapper.unapply(queryResult); 
/*
returns {
  myJsonProperty: 5,
  myNested: {
   jsonProperty: 'with text'
  } 
}
 */
```

## API

The basic concept of this library is that of a *mapper*. A mapper is a plain javascript object with two methods: `apply` and `unapply`. The transformation between the hierarchical and the relation representation is performed by applying a pipeline of mappers:

```
json -> mapper1.apply -> mapper2.apply -> mapper3.apply -> db object
db object -> mapper3.unapply -> mapper2.unapply -> mapper1.unapply -> json
```
 
The module exposes the following mappers:

### flatten(delimiter)

Transforms a hierarchical structure to a flat property where the path is indicated by the given delimiter.

Examples:
```javascript
var relmapper = require('relmapper');
var json = { a: { b: { c: 1 } } };
relmapper.flatten('__').apply(json);
/*
returns { a__b__c: 1 }
 */

var result = { a__b__c: 1 };
relmapper.flatten('__').unapply(result);
/*
returns { a: { b: { c: 1 } } }
 */
```

### case

Transforms camel case to snake case and vice versa. This is needed since most relational database systems are case insensitive.

Examples:
```javascript
var relmapper = require('relmapper');
var json = { aCamelCaseProperty: 1 };
relmapper.case.apply(json);
/*
returns { a_camel_case_property: 1 }
 */

var result = { a_camel_case_property: 1 };
relmapper.case.unapply(result);
/*
returns { aCamelCaseProperty: 1 }
 */
```

Mappers can be combined to form more complex mappers:

### sequence(...mappers)

Creates a pipeline of mappers that are applied in sequence. The order is reversed when unapplying.

The library also publishes a `default` mapper which is defined as a sequence of flatten and case:

```javascript
var default = relmapper.sequence(relmapper.flatten('__'), relmapper.case);
```

See the getting started section for an example of this mapper.