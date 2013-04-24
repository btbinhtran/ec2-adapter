
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')
  , query = require('tower-query')
  , proto = require('./lib/proto');

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
    return query().start('ec2.' + obj);
  } else {
    init(obj || adapter('ec2'));
    return ec2;
  }
}

/**
 * Wire up the adapter.
 */

function init(obj) {

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
    obj.model.load(name, require.resolve('./lib/models/' + name));
  });

  for (var key in proto) obj[key] = proto[key];

  return obj;
}

/**
 * Common init for all actions.
 */

function initContext(context){
  context.ec2 = ec2;
}