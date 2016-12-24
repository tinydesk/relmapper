const chai = require('chai');
const should = chai.should();
const mapper = require('../index');

const tester = obj => (json, db) => {
  it(`should correctly apply`, () => obj.apply(json).should.eql(db));
  it(`should correctly unapply`, () => obj.unapply(db).should.eql(json));
}

describe('case', () => {

  const test = tester(mapper.case);

  test({ myPropertyName: 1 }, { my_property_name: 1 });
  test({ propertyname: 1 }, { propertyname: 1 });
  test({ "property.myName": 1 }, { "property.my_name": 1 });

});

describe('flatten', () => {

  const test = tester(mapper.flatten);

  test({ myPropertyName: 1 }, { myPropertyName: 1 });
  test(
    {
      myPropertyName: 1,
      nestedProperty: {
        anotherProperty: 2
      }
    },
    {
      myPropertyName: 1,
      "nestedProperty.anotherProperty": 2
    }
  );

});

describe('sequence', () => {

  const test = tester(mapper.sequence(mapper.flatten, mapper.case));

  test(
    {
      myPropertyName: 1,
      nestedProperty: {
        anotherProperty: 2
      }
    },
    {
      my_property_name: 1,
      "nested_property.another_property": 2
    }
  );

});