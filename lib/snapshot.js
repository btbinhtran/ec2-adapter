
// snapshots are "backups" of EC2 instances.

/**
 * Query snapshots.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeSnapshots.html
 */

exports.find = function(context, data, fn){
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

exports.create = function(context, data, fn){
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

exports.remove = function(context, data, fn){
  var options = context.data[0] || {};

  var params = {
      'SnapshotId': options.id
  };

  context.ec2.call('DeleteSnapshot', params, function(err, result){
    context.emit('data', result);
  });
}