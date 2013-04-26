
/**
 * Expose `key`.
 */

module.exports = key;

/**
 * Define the `key` model and actions.
 */

function key(model, adapter){
  model
    // KeyName
    .attr('name', 'string')
    .action('create', create)
    .action('find', find)
      //.param('name', 'string').alias('key-name');
      // KeyName.n
      .param('name', ['string', 'array'])
        // .validate()
      // Filter.n.Name
      // fingerprint
      // key-name
    .action('remove', remove);
}

/**
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeKeyPairs.html
 */

function find(ctx, data, fn) {
  // XXX: need a better way to globally setup variables
  var client = require('tower-adapter')('ec2').client;
  var params = {};// { 'KeyName.1': 'x' };
  //params['Filter.1.Name'] = 'key-name';
  //params['Filter.1.Value.1'] = 'x';

  client.call('DescribeKeyPairs', params, function(err, result){
    console.log(JSON.stringify(result, null, 2))
    ctx.emit('data', deserializeFind(result));
    fn(); // fn(err, result);
  });
}

/**
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-CreateKeyPair.html
 * @see http://stackoverflow.com/questions/3260739/add-keypair-to-existing-ec2-instance
 * @see http://stackoverflow.com/questions/6119774/ssh-to-aws-instance-without-key-pairs
 * @see https://console.aws.amazon.com/ec2/home?region=us-east-1#s=SecurityGroups
 *    - then you have to open up port 22 (TCP)!!! for the security group
 *    - set ports security group ec2
 * 
 * THIS WORKED:
 * $ ssh -i <keyname>.pem ubuntu@<public-dns>
 *
 * This example is for an EC2 security group. The request grants TCP port 80 access from the source group called OtherAccountGroup (in AWS account 111122223333) to your websrv security group.

https://ec2.amazonaws.com/?Action=AuthorizeSecurityGroupIngress
&GroupName=websrv
&IpPermissions.1.IpProtocol=tcp
&IpPermissions.1.FromPort=80
&IpPermissions.1.ToPort=80
&IpPermissions.1.Groups.1.GroupName=OtherAccountGroup
&IpPermissions.1.Groups.1.UserId=111122223333
&AUTHPARAMS

 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-AuthorizeSecurityGroupIngress.html

 https://ec2.amazonaws.com/
?Action=AuthorizeSecurityGroupIngress
&GroupName=default
&IpPermissions.1.IpProtocol=tcp
&IpPermissions.1.FromPort=22
&IpPermissions.1.ToPort=22
&IpPermissions.1.IpRanges.1.CidrIp=your-local-system's-public-ip-address/32
&AUTHPARAMS
 */

function create(ctx, data, fn) {
  var options = ctx.data[0] || {};

  var params = {
    'KeyName': options.name
  };

  ctx.client.call('CreateKeyPair', params, function(err, result){
    console.log(JSON.stringify(result, null, 2))
    ctx.emit('data', deserializeCreate(result));
    fn(); // fn(err, result);
  });
}

/**
 * Remove key pair.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteKeyPair.html
 */

function remove(ctx, data, fn) {
  // ctx.client.call('DeleteKeyPair');
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
  return result;
}

function deserializeCreate(result) {
  return result;
}