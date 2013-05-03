
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')
  , query = require('tower-query')
  , proto = require('./lib/proto')
  , serializer = require('./lib/serializer');

/**
 * Expose `ec2` adapter.
 */

module.exports = ec2;

/**
 * Define `ec2` adapter.
 */

function ec2(obj) {
  if ('string' === typeof obj) {
    // XXX: perform a simple query.
    // XXX: refactor out to adapter base module.
    // return query().start('ec2.' + obj);
    return query().use('ec2').start('ec2.' + obj);
  } else {
    return adapter('ec2');
  }
}

adapter.api('ec2', ec2);
load(adapter('ec2'));

/**
 * Wire up the adapter.
 */

function load(obj) {
  /**
   * Lazy-loaded dependencies.
   */

  [
    'address',
    'group', // security-group
    'image',
    'instance',
    'key', // key-pair
    'region',
    'route',
    'route-table',
    'snapshot',
    'tag',
    'volume',
    'zone' // availability zone
  ].forEach(function(name){
    // XXX: load should handle namespacing
    // XXX: should only attach one event handler, and delegate them,
    //      then it should remove it after it's done.
    //      so, a `once` event handler.
    obj.model.load('ec2.' + name, require.resolve('./lib/models/' + name), serializer);
  });

  // XXX: refactor
  require('tower-stream').on('define ec2', function(action){
    action.format = format;
  });

  for (var key in proto) obj[key] = proto[key];

  return obj;
}

function format(type, name) {
  // get last defined attribute.
  var param = this.context;
  name || (name = param.name);

  // format('param.ec2')
  // type('ec2.filter')
  param.format = function(ctx, attr, constraint){
    return { type: type, key: name, val: constraint[constraint.length - 1].right.value, kind: param.type };
  }

  return this;
}

/*
serializer('ec2')
  .format('filter', function(name){

  });

adapter('ec2')
  // format a param!
  .format('filter', function(name){
    return function filter(action, constraint){

    }
  })
  .format('basic')

adapter('ec2')
  .type('filter')
  .type('basic');
*/