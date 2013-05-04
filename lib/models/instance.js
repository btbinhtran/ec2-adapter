
/**
 * Module dependencies.
 */

var serializer = require('../serializer');

/**
 * Expose `instance`.
 */

module.exports = instance;

/**
 * Define `instance`.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Instances.html
 */

function instance(model) {
  model('instance')
    //.id('id')
    .attr('status')
    .action('find', find)
      .param('id', 'array')
        .format('basic', 'InstanceId')
      .param('architecture', 'string')
        .format('filter')
        .validate('in', [ 'i386', 'x86_64' ])
      .param('availability-zone', 'string')
        .format('filter')
      // The public DNS name of the instance.
      .param('dns-name')
        .format('filter')
      // The ID of the security group for the instance. If the instance is in a VPC, use instance.group-id instead.
      .param('group-id')
        .format('filter')
      // The ID of the image used to launch the instance.
      .param('image-id')
        .format('filter')
      .param('status')
        .format('filter', 'instance-state-name')
        .validate('in', [ 'pending', 'running', 'shutting-down', 'terminated', 'stopping', 'stopped' ])
        // 0 (pending) | 16 (running) | 32 (shutting-down) | 48 (terminated) | 64 (stopping) | 80 (stopped)
      .param('type')
        .format('filter', 'instance-type')
      .param('key')
        .format('filter', 'key-name')
      .param('isWindows')
        .format('filter', 'platform')
    .action('create', create)
      .attr('imageId')
        .alias('i')
        .format('basic', 'ImageId')
      .attr('min', 'integer', 1)
        .format('basic', 'MinCount')
      .attr('max', 'integer', 1)
        .format('basic', 'MaxCount')
      .attr('key')
        .alias('k')
        .format('basic', 'KeyName')
      .attr('groupName', 'array')
        .alias('g')
        .format('basic', 'SecurityGroup.{i}')
    .action('remove', remove)
      .param('imageId')
        .alias('i')
        .format('basic', 'ImageId')
}

/**
 * Find an image.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeImages.html
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeInstances.html
 */

function find(ctx, data, fn) {
  var params = serializer.queryParams(ctx);

  ctx.client.call('DescribeInstances', ctx, function(err, result){
    ctx.emit('data', deserializeFind(result));
    fn();
  });
}

/**
 * Create an image.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-RunInstances.html
 * @see https://console.aws.amazon.com/ec2/home?region=us-east-1#s=Instances
 * @see {Windows instances (for IE testing)} http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/LaunchingAndUsingInstancesWindows.html
 * @see https://github.com/opscode/knife-ec2/blob/master/lib/chef/knife/ec2_server_create.rb
 * @see https://github.com/opscode/chef/blob/2c0040c95bb942d13ad8c47498df56be43e9a82e/lib/chef/knife/bootstrap.rb
 * @see https://github.com/opscode/chef/blob/master/lib/chef/knife/ssh.rb
 * @see https://github.com/opscode/chef/tree/master/lib/chef/knife/bootstrap
 * @see https://github.com/opscode/chef/blob/master/lib/chef/knife/bootstrap/ubuntu12.04-gems.erb
 * @see http://unix.stackexchange.com/questions/5665/what-does-etc-stand-for
 */

function create(ctx, data, fn) {
  var data = ctx.data[0] || {};
  var params = serializer.queryParams(ctx, data);

  ctx.client.call('RunInstances', params, function(err, result){
    ctx.emit('data', deserializeCreate(result));
    fn(); // fn(err, result);
  });
}

/**
 * Remove an image.
 *
 * "terminate" removes it, but it won't get removed from the list for 10-20 minutes.
 *
 * @see https://forums.aws.amazon.com/message.jspa?messageID=420769
 * @see http://aws.amazon.com/articles/637
 * @see http://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-delete.html
 * @see http://serverfault.com/questions/117123/how-to-delete-instances-in-amazon-ec2-change-pair-key
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-TerminateInstances.html
 */

function remove(ctx, data, fn) {
  var data = ctx.data[0] || {};
  var params = serializer.queryParams(ctx, data);

  //https://ec2.amazonaws.com/?Action=TerminateInstances&InstanceId.1=i-3ea74257&AUTHPARAMS
  ctx.client.call('TerminateInstances', params, function(err, result){
    ctx.emit('data', deserializeCreate(result));
    fn(); // fn(err, result);
  });
}

function deserializeFind(result) {
  var items = result.reservationSet.item;
  if (!Array.isArray(items)) items = [items];

  var instances = []
    , instance;

  if (!items.length) return instances;

  items.forEach(function(i){
    instance = {
        id: i.instancesSet.item.instanceId
      , imageId: i.instancesSet.item.imageId
      , status: i.instancesSet.item.instanceState.name
      , host: i.instancesSet.item.dnsName
      , createdAt: i.instancesSet.item.launchTime
      , ip: i.instancesSet.item.ipAddress
      , architecture: i.instancesSet.item.architecture
      , type: i.instancesSet.item.instanceType
      , placement: i.instancesSet.item.placement.availabilityZone
    };

    instances.push(instance);
  });

  return instances;
}

function deserializeCreate(result) {
  if (!result.instancesSet) return [];
  var items = result.instancesSet.item;
  if (!Array.isArray(items)) items = [items];

  var instances = []
    , instance;

  if (!items.length) return instances;

  items.forEach(function(i){
    instance = {
        id: i.instanceId
      , imageId: i.imageId
      , status: (i.instanceState || i.currentState).name
      , host: i.dnsName
      , createdAt: i.launchTime
      , ip: i.ipAddress
      , architecture: i.architecture
      , type: i.instanceType
      , placement: i.placement && i.placement.availabilityZone
    };

    instances.push(instance);
  });

  return instances;
}