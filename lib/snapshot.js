 
/**
 * Expose `snapshot`.
 */

module.exports = snapshot;

/**
 * Define `snapshot`.
 *
 * Snapshots are "backups" of EC2 instances.
 */

function snapshot(model) {
  model
    .action('find', find)
    .action('create', create)
    .action('remove', remove);
}

/**
 * Query snapshots.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeSnapshots.html
 */

function find(context, data, fn) {
  var params = {};

  context.ec2.call('DescribeSnapshots', params, function(err, result){
    context.emit('data', result);
  });
}

/**
 * Create a snapshot (backup) of an EC2 instance.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-CreateSnapshot.html
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-CopySnapshot.html
 */

function create(context, data, fn) {
  var options = context.data[0] || {};

  var params = {
      'VolumeId': options.volumeId
  };

  context.ec2.call('CreateSnapshot', params, function(err, result){
    context.emit('data', result);
  });
}

/**
 * Remove snapshot.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteSnapshot.html
 */

function remove(context, data, fn) {
  var options = context.data[0] || {};

  var params = {
      'SnapshotId': options.id
  };

  context.ec2.call('DeleteSnapshot', params, function(err, result){
    context.emit('data', result);
  });
}