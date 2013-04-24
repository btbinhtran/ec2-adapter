
/**
 * Expose `group`.
 */

module.exports = group;

/**
 * Define `group`.
 */

function group(model) {
  model
    .action('find', find)
    .action('create', create)
    .action('update', update)
    .action('remove', remove);
}

/**
 * Query security groups.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeSecurityGroups.html
 */

function find(context, data, fn) {
  context.ec2.call('DescribeSecurityGroups', params, function(err, result){
    context.emit('data', result);
  });
}

/**
 * Create a security group.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-CreateSecurityGroup.html
 */

function create(context, data, fn) {
  var options = context.data[0] || {};

  // validate:
  // Accepts alphanumeric characters, spaces, periods, dashes, and underscores.

  var params = {
      GroupName: options.name
    , GroupDescription: options.description
  };

  context.ec2.call('CreateSecurityGroup', params, function(err, result){
    context.emit('data', result);
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
 *    ec2('security-group').update({ ports: [ 22, 80, 8080 ]});
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-AuthorizeSecurityGroupIngress.html
 * @see http://www.iana.org/assignments/protocol-numbers/protocol-numbers.xml
 */

function update(context, data, fn) {
  // XXX: or constraints.
  var options = context.data[0] || {};

  // TCP: 6
  var params = {
    'IpPermissions.1.IpProtocol': 'tcp'
  };

  if (Array.isArray(options.ports)) {
    options.ports.forEach(function(port, i){
      params['IpPermissions.' + (i + 1) + '.FromPort'] = port;
      params['IpPermissions.' + (i + 1) + '.ToPort'] = port;
    });
  }

  if (options.name) {
    params['GroupName'] = options.name;
  }

  context.ec2.call('AuthorizeSecurityGroupIngress', params, function(err, result){
    context.emit('data', result);
  });
}

/**
 * Remove security group(s).
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DeleteSecurityGroup.html
 */

function remove(context, data, fn) {
  var options = context.data[0] || {};

  var params = {
    'GroupName': options.name
  };

  context.ec2.call('DeleteSecurityGroup', params, function(err, result){
    context.emit('data', result);
  });
}