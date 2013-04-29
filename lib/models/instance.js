
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
  model
    .id('id', { alias: 'instanceId' })
    .attr('status', { alias: 'instanceState.name' })
    .action('find', find)
    .action('create', create)
    .action('remove', remove);
}

/**
 * Find an image.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeImages.html
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeInstances.html
 */

function find(ctx, data, fn) {
  ctx.client.call('DescribeInstances', {}, function(err, result){
    //console.log(JSON.stringify(result, null, 2))
    ctx.emit('data', deserializeFind(result));
    fn();
    // fn(err, instances);
  });
}

/**
 * Create an image.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-RunInstances.html
 * @see https://console.aws.amazon.com/ec2/home?region=us-east-1#s=Instances
 * @see {Windows instances (for IE testing)} http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/LaunchingAndUsingInstancesWindows.html
 */

function create(ctx, data, fn) {
  var options = ctx.data[0] || {};
  // https://ec2.amazonaws.com/?Action=RunInstances&ImageId=ami-60a54009&MaxCount=3&MinCount=1&Placement.AvailabilityZone=us-east-1b&Monitoring.Enabled=true&AUTHPARAMS
  options.max || (options.max = 1);
  options.min || (options.min = options.max);
  var params = { 'ImageId': options.imageId, 'MaxCount': options.max, 'MinCount': options.min };
  //params['KeyName'] = options.key;
  //if (!params['KeyName'])
  //  throw new Error('Must pass a `key` for the key-pair');
  // params['Placement.AvailabilityZone'] = 'us-west-2';
  ctx.client.call('RunInstances', params, function(err, result){
    console.log(JSON.stringify(result, null, 2))
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
  var records = ctx.data
    , params = {};

  for (var i = 0, n = records.length; i < n; i++) {
    params['InstanceId.' + (i + 1)] = records[i].id;
  }

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