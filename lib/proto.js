
/**
 * Module dependencies.
 */

var Topology = require('tower-topology').Topology
  , stream = require('tower-stream')
  , model = require('tower-model')
  , aws = require('aws-lib');

/**
 * Connect to ec2.
 */

exports.connect = function(options, fn){
  this.client = aws.createEC2Client(options.key, options.secret, { version: '2013-02-01' });
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
        model(criterion[1]);
        topology.stream(name = criterion[1] + '.' + action, { constraints: [] });
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

  // XXX: need to refactor topology api a little.
  topology.on('data', function(data){
    fn(null, data);
  });

  return topology;
}

/**
 * Disconnect from ec2.
 */

exports.disconnect = function(options, fn){
  delete this.client;
  fn();
}