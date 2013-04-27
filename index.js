
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
      'address'
    , 'group' // security-group
    , 'image'
    , 'instance'
    , 'key' // key-pair
    , 'region'
    , 'route'
    , 'route-table'
    , 'snapshot'
    , 'tag'
    , 'volume'
    , 'zone' // availability zone
  ].forEach(function(name){
    // XXX: load should handle namespacing
    // XXX: should only attach one event handler, and delegate them,
    //      then it should remove it after it's done.
    //      so, a `once` event handler.
    obj.model.load('ec2.' + name, require.resolve('./lib/models/' + name), serializer);
  });

  // XXX: refactor
  require('tower-stream').on('define ec2', function(action){
    action.to = function(type, name) {
      // get last defined attribute.
      var attr = this.context;
      name || (name = attr.name);

      attr.to = function(ctx, attr, constraint) {
        return { type: 'filter', key: name, val: constraint[constraint.length - 1] };
      }

      return this;
    }
  });

  for (var key in proto) obj[key] = proto[key];

  return obj;
}