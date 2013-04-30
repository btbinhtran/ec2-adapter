
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')
  , query = require('tower-query')
  , validate = require('tower-validate')
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
  if (!loaded) load(adapter('ec2'));

  if ('string' === typeof obj) {
    // XXX: perform a simple query.
    // XXX: refactor out to adapter base module.
    // return query().start('ec2.' + obj);
    return query().use('ec2').start('ec2.' + obj);
  } else {
    return adapter('ec2');
  }
}

['connect', 'disconnect'].forEach(function(method){
  ec2[method] = function(){
    return ec2()[method].apply(adapter('ec2'), arguments);
  }
});

var loaded = false;

/**
 * Wire up the adapter.
 */

function load(obj) {
  loaded = true;

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
    'route-,table'
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

    // XXX: deprecate
    action.to = action.format;

    action.validate = validates;
  });

  for (var key in proto) obj[key] = proto[key];

  return obj;
}

function format(type, name) {
  // get last defined attribute.
  var attr = this.context;
  name || (name = attr.name);

  attr.to = function(ctx, attr, constraint) {
    return { type: 'filter', key: name, val: constraint[constraint.length - 1] };
  }

  return this;
}

function validates(type, val) {
  // XXX: if this.context is attr, then do what it does now,
  //      otherwise do a general validation on the whole query.
  var attr = this.context;

  var validator = validate.validator(type);

  this.validators.push(function(ctx, constraints){
    // XXX: plenty of room for optimization, since this is called
    // for every validator (for each validator, iterate through all the constraints).
    for (var i = 0, n = constraints.length; i < n; i++) {
      var constraint = constraints[i][1];
      if (attr.name === constraint.left.attr) {
        // e.g. `validate(status: in: [1, 2])`
        validator(obj, constraint.left.attr, constraint.right.val);
      }
    }
  });
}