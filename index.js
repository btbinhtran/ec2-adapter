
/**
 * Module dependencies.
 */

var proto = require('./lib/proto');

/**
 * Expose `ec2` adapter.
 */

module.exports = ec2;

/**
 * Define `ec2` adapter.
 */

function ec2(adapter) {

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
    , 'routeTable'
    , 'snapshot'
    , 'tag'
    , 'volume'
    , 'zone' // availability zone
  ].forEach(function(name){
    adapter.model.load(name, require.resolve('./lib/models/' + name));
  });

  for (var key in proto) adapter[key] = proto[key];
}

/**
 * Common init for all actions.
 */

function init(context){
  context.ec2 = ec2;
}