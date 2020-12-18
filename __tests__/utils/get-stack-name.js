'use strict';

const test = require('ava');
const sinon = require('sinon');

const utils = require('../../lib/utils');

const fullResources = {};

for (let i = 0; i < 500; i++) {
	fullResources[i] = {};
}

test.beforeEach(t => {
	t.context = Object.assign({}, utils);
});

test('returns destination (simple case)', t => {
	const stackName = t.context.getStackName('Foo');
	t.deepEqual(stackName, 'FooNestedStack');
});

test('throws when stack is full and allowSuffix is false', t => {
	const stub = sinon.stub(t.context, 'nestedStack')
		.onCall(0).returns({
			Resources: fullResources
		})
		.onCall(1).returns({
			Resources: {
				Foo: {}
			}
		});

	const err =	t.throws(() => t.context.getStackName('Foo'));
	t.true(stub.calledOnce);
	t.deepEqual(err.message, 'Destination stack Foo is already full!');
});

test('returns a suffixed name (one full stack)', t => {
	const stub = sinon.stub(t.context, 'nestedStack')
		.onCall(0).returns({
			Resources: fullResources
		})
		.onCall(1).returns({
			Resources: {
				Foo: {}
			}
		});

	const stackName = t.context.getStackName('Foo', true);
	t.deepEqual(stackName, 'FooNestedStack2');
	t.true(stub.calledTwice);
});

test('returns a suffixed name (two full stacks)', t => {
	const stub = sinon.stub(t.context, 'nestedStack')
		.onCall(0).returns({
			Resources: fullResources
		})
		.onCall(1).returns({
			Resources: fullResources
		})
		.onCall(2).returns({
			Resources: {}
		});

	const stackName = t.context.getStackName('Foo', true);
	t.deepEqual(stackName, 'FooNestedStack3');
	t.true(stub.calledThrice);
});
