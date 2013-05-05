
/**
 * Module dependencies.
 */

var serializer = require('../serializer');

/**
 * Expose `key`.
 */

module.exports = key;

/**
 * Define the `key` model and actions.
 */

function key(model){
  model('key')
    .attr('name', 'string')
      //.format('basic', 'KeyName')
      .validate('present')
    .attr('body', 'text')
      //.format('basic', 'PublicKeyMaterial')
    .action('find', find)
      .param('name', [ 'string' ])
        .format('basic', 'KeyName.{i}')
    .action('create', create)
      .attr('name')
        .alias('n')
        .format('basic', 'KeyName')
        .validate('present')
      .attr('body', 'text')
        .alias('k')
        .format('basic', 'PublicKeyMaterial')
    .action('remove', remove)
      .param('name')
        .alias('n')
        .format('basic', 'KeyName');
        //.validate('present');
}

/**
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeKeyPairs.html
 */

function find(ctx, data, fn) {
  var params = serializer.queryParams(ctx);
  
  ctx.client.call('DescribeKeyPairs', params, function(err, result){
    ctx.emit('data', deserializeFind(result));
    fn();
  });
}

/**
 * Create a public/private key.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-ImportKeyPair.html
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-CreateKeyPair.html
 * @see http://stackoverflow.com/questions/3260739/add-keypair-to-existing-ec2-instance
 * @see http://stackoverflow.com/questions/6119774/ssh-to-aws-instance-without-key-pairs
 * @see https://console.aws.amazon.com/ec2/home?region=us-east-1#s=SecurityGroups
 *    - then you have to open up port 22 (TCP)!!! for the security group
 *    - set ports security group ec2
 */

function create(ctx, data, fn) {
  var data = ctx.data[0] || {};
  var params = serializer.queryParams(ctx, data);
  var method = null != params.body ? 'ImportKeyPair' : 'CreateKeyPair';

  ctx.client.call(method, params, function(err, result){
    ctx.emit('data', deserializeCreate(result));
    fn();
  });
}

/**
 * Remove key pair.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteKeyPair.html
 */

function remove(ctx, data, fn) {
  var params = serializer.queryParams(ctx);

  ctx.client.call('DeleteKeyPair', params, function(err, result){
    ctx.emit('data', deserializeCreate(result));
    fn();
  });
}

/**
 * Import key pair.
 *
 * XXX: somehow tie this into `create`
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-ImportKeyPair.html
 */

function load(ctx, data, fn) {

}

function deserializeFind(result) {
  if (result.keySet && result.keySet.item) {
    return Array.isArray(result.keySet.item)
      ? result.keySet.item
      : [result.keySet.item];
  }

  return [];
}

function deserializeCreate(result) {
  // keyName: 'x',
  // keyFingerprint: 'y',
  // keyMaterial: 'z'
  return result;
}