
/**
 * Module dependencies.
 */

var serializer = require('../serializer');

/**
 * Expose `group`.
 */

module.exports = group;

/**
 * Define `group`.
 */

function group(model) {
  var textPattern = /[a-zA-Z]|[\._\-\:\/\(\)\#\,@\[\]\+\=\&\;\{\}\!\$\*]/g;

  model('group')
    .attr('name', 'string')
      .validate('present')
      .validate('match', textPattern)
    .attr('description', 'text')
      .validate('present')
      .validate('match', textPattern)
    .attr('vpcId') // VpcId
    .action('find', find)
      .param('name', 'array')
        .alias('n')
        .format('basic', 'GroupName.{i}')
      .param('id', 'array')
        .format('basic', 'GroupId.{i}')
      .param('ownerId', 'string')
        .format('filter', 'owner-id')
      .param('description')
        .format('filter')
      .param('groupName')
        .format('filter', 'group-name')
      .param('protocol')
        .format('filter', 'ip-permission.protocol')
    .action('create', create)
      .attr('name', 'string')
        .alias('n')
        .validate('present')
        .validate('match', textPattern)
      .attr('description', 'text')
        .alias('d')
        .validate('present')
        .validate('match', textPattern)
      .attr('vpcId')
        .alias('v') // VpcId
    .action('update', update)
      // XXX: there are both params and attrs in this case.
      //      you want update specific attributes based on query params.
      // XXX: should combine attributes from action and parent model.
      // XXX: requires either `groupId` or `groupName`.
      //      how to handle both?
      .param('groupId')
        .format('basic', 'GroupId')
      .param('name')
        .alias('n')
        .format('basic', 'GroupName')
        //.validate('present')
      .param('protocol', [ 'integer' ])
        .alias('i')
        // XXX: this needs to be defined for each `port`
        .format('basic', 'IpPermissions.{i}.IpProtocol')
        // XXX: need way to be able to print validation requirements on cli:
        // "protocol must be in [ 'tcp', 'udp', 'icmp' ]"
        // XXX: validations aren't working
        //.validate('in', [ 'tcp', 'udp', 'icmp' ])
        .validate('present')
      .param('port', 'array')//['range'])
        .alias('p')
        .format('basic', [ 'IpPermissions.{i}.FromPort', 'IpPermissions.{i}.ToPort' ])
      //.param('toPort', 'array')
      //  .format('basic', 'IpPermissions.{i}.toPort')
    .action('remove', remove)
      .param('name')
        .alias('n')
        .format('basic', 'GroupName');
}

/**
 * Query security groups.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeSecurityGroups.html
 */

function find(ctx, data, fn) {
  var params = serializer.queryParams(ctx);
  
  ctx.client.call('DescribeSecurityGroups', params, function(err, result){
    ctx.emit('data', deserializeFind(result));
  });
}

/**
 * Create a security group.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-CreateSecurityGroup.html
 */

function create(ctx, data, fn) {
  var data = ctx.data[0] || {};
  var params = serializer.queryParams(ctx, data);

  ctx.client.call('CreateSecurityGroup', params, function(err, result){
    ctx.emit('data', result);
  });
}

/**
 * Update (configure) a security group.
 *
 * Sometimes this will be called in `create`
 * b/c Amazon has a weird API and doesn't let you
 * set certain properties on `create`.
 *
 * Example: Open ports 22, 80, and 8080 (for working w/ node.js)
 *
 *    ec2('security-group').update({ ports: [ 22, 80, 8080 ] });
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-AuthorizeSecurityGroupIngress.html
 * @see http://www.iana.org/assignments/protocol-numbers/protocol-numbers.xml
 */

function update(ctx, data, fn) {
  var data = ctx.data && ctx.data[0] || {};
  var params = serializer.queryParams(ctx, data);
  console.log(params);

  ctx.client.call('AuthorizeSecurityGroupIngress', params, function(err, result){
    ctx.emit('data', result);
  });
}

/**
 * Remove security group(s).
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteSecurityGroup.html
 */

function remove(ctx, data, fn) {
  var params = serializer.queryParams(ctx);

  ctx.client.call('DeleteSecurityGroup', params, function(err, result){
    ctx.emit('data', result);
    fn();
  });
}

function deserializeFind(result) {
  if (!(result.securityGroupInfo && result.securityGroupInfo.item))
    return [];

  var items = result.securityGroupInfo.item;

  return items;
}