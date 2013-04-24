
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')
  , model = require('tower-model')
  , Topology = require('tower-topology').Topology
  , stream = require('tower-stream')
  , aws = require('aws-lib')
  , address = require('./lib/address')
  , availabilityZone = require('./lib/availability-zone')
  , certificate = require('./lib/certificate')
  , image = require('./lib/image')
  , instance = require('./lib/instance')
  , region = require('./lib/region')
  , route = require('./lib/route')
  , routeTable = require('./lib/route-table')
  , securityGroup = require('./lib/security-group')
  , snapshot = require('./lib/snapshot')
  , tag = require('./lib/tag')
  , volume = require('./lib/volume')
  , ec2;


adapter.model = model;

/**
 * Expose `ec2` adapter.
 */

var exports = module.exports = adapter('ec2')
  , model = exports.model;

/**
 * `Address` model.
 */

model('address')
  .attr('city')
  //.actions(require('./lib/address'));

/**
 * `AvailabilityZone` model.
 */

model('availability-zone')
  .attr('name', 'string', { alias: 'zoneName' })
  .attr('status', 'string', { alias: 'zoneState' })
  .attr('region', 'string', { alias: 'regionName' })
  .action('find', availabilityZone.find);

model('certificate');

stream('ec2.certificate.create')
  .on('init', function(context){
    context.ec2 = ec2;
  })
  .on('exec', certificate.create)

stream('ec2.certificate.find')
  .on('init', function(context){
    context.ec2 = ec2;
  })
  .on('exec', certificate.find)

model('image');

stream('ec2.image.find')
  // XXX: maybe an API to do the same thing to every stream?
  // (since `context.ec2 = ec2` needs to happen everywhere).
  .on('init', function(context){
    context.ec2 = ec2;
  })
  .on('exec', image.find)

/**
 * `Instance` model.
 */

model('instance')
  .id('id', { alias: 'instanceId' })
  .attr('status', { alias: 'instanceState.name' })
  //.action('find')
  .action('create', instance.create)
  .action('remove', instance.remove);

stream('ec2.instance.find')
  // XXX: maybe an API to do the same thing to every stream?
  // (since `context.ec2 = ec2` needs to happen everywhere).
  .on('init', function(context){
    context.ec2 = ec2;
  })
  .on('exec', instance.find)

stream('ec2.instance.create')
  // XXX: maybe an API to do the same thing to every stream?
  // (since `context.ec2 = ec2` needs to happen everywhere).
  .on('init', function(context){
    context.ec2 = ec2;
  })
  .on('exec', instance.create)

stream('ec2.instance.remove')
  // XXX: maybe an API to do the same thing to every stream?
  // (since `context.ec2 = ec2` needs to happen everywhere).
  .on('init', function(context){
    context.ec2 = ec2;
  })
  .on('exec', instance.remove)

model('region');

model('route');

model('route-table');

model('security-group');

stream('ec2.security-group.create')
  .on('init', function(context){
    context.ec2 = ec2;
  })
  .on('exec', securityGroup.create);

stream('ec2.security-group.update')
  .on('init', function(context){
    context.ec2 = ec2;
  })
  .on('exec', securityGroup.update);

stream('ec2.security-group.find')
  .on('init', function(context){
    context.ec2 = ec2;
  })
  .on('exec', securityGroup.find);

model('snapshot');

model('tag');

model('volume');

/**
 * Connect to ec2.
 */

exports.connect = function(options, fn){
  ec2 = aws.createEC2Client(options.key, options.secret, { version: '2013-02-01' });
  if (fn) fn();
}

exports.execute = function(criteria, fn){
  var topology = new Topology
    , name;

  var action = criteria[criteria.length - 1][1];

  // XXX: this function should just split the criteria by model/adapter.
  // then the adapter
  for (var i = 0, n = criteria.length; i < n; i++) {
    var criterion = criteria[i];
    switch (criterion[0]) {
      case 'select':
      case 'start':
        topology.stream(name = 'ec2.' + criterion[1] + '.' + action, { constraints: [] });
        break;
      case 'constraint':
        topology.streams[name].constraints.push(criterion);
        break;
      case 'action':
        topology.streams[name].data = criterion[2];
        break;
    }
  }

  // XXX: need to come up w/ API for adding events before it's executed.
  process.nextTick(function(){
    topology.exec();
  });

  return topology;
}

/**
 * Disconnect from ec2.
 */

exports.disconnect = function(options, fn){
  ec2 = undefined;
  fn();
}