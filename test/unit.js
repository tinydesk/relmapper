const chai = require('chai');
const should = chai.should();
const mapper = require('../dist/index');

const tester = obj => (json, db) => {
  it(`should correctly apply`, () => obj.apply(json).should.eql(db));
  it(`should correctly unapply`, () => obj.unapply(db).should.eql(json));
}

describe('case', () => {

  const test = tester(mapper.camelCase);

  test({ myPropertyName: 1 }, { my_property_name: 1 });
  test({ propertyname: 1 }, { propertyname: 1 });
  test({ "property.myName": 1 }, { "property.my_name": 1 });

  test([
    { myPropertyName: 1 },
    { myPropertyName: 2 },
    { myPropertyName: 3 }
  ],
  [
    { my_property_name: 1 },
    { my_property_name: 2 },
    { my_property_name: 3 }
  ]);

});

describe('flatten', () => {

  const test = tester(mapper.flatten('_'));

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
      "nestedProperty_anotherProperty": 2
    }
  );
  test(
    {
      date: new Date('2015-09-01T00:00:00.000Z'),
      type: 'tour',
      timeAbroad: 0,
      pause: 1.5,
      standing: 5,
      absence: {
        start: new Date('2015-09-01T03:22:00.000Z'),
        end: new Date('2015-09-01T15:40:00.000Z')
      },
      destination: { country: 'at', location: 'L7A' },
      working: {
        start: new Date('2015-09-01T03:22:00.000Z'),
        end: new Date('2015-09-01T15:40:00.000Z')
      }
    },
    {
      date: new Date('2015-09-01T00:00:00.000Z'),
      type: 'tour',
      timeAbroad: 0,
      pause: 1.5,
      standing: 5,
      absence_start: new Date('2015-09-01T03:22:00.000Z'),
      absence_end: new Date('2015-09-01T15:40:00.000Z'),
      destination_country: 'at', 
      destination_location: 'L7A',
      working_start: new Date('2015-09-01T03:22:00.000Z'),
      working_end: new Date('2015-09-01T15:40:00.000Z')
    }
  )
  test([
    { a: { b: { c: 3 } } },
    { a: { b: { c: 2 } } },
    { a: { b: { c: 1 } } }
  ], [
    { a_b_c: 3 },
    { a_b_c: 2 },
    { a_b_c: 1 }
  ])

});

describe('sequence', () => {

  describe('case _, flatten .', () => {
    const test = tester(mapper.sequence(mapper.flatten('.'), mapper.camelCase));
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

  describe('case _, flatten __', () => {
    const test = tester(mapper.sequence(mapper.flatten('__'), mapper.camelCase));
    test(
      {
        myPropertyName: 1,
        nestedProperty: {
          anotherProperty: 2
        },
        premium: {
          period: {
            length: 5
          }
        }
      },
      {
        my_property_name: 1,
        nested_property__another_property: 2,
        premium__period__length: 5
      }
    );
    test([
        { myPropertyName: { myNestedPropertyName: 1 } },
        { myPropertyName: { myNestedPropertyName: 2 } },
        { myPropertyName: { myNestedPropertyName: 3 } }
      ],
      [
        { my_property_name__my_nested_property_name: 1 },
        { my_property_name__my_nested_property_name: 2 },
        { my_property_name__my_nested_property_name: 3 }
      ]);
  });

});