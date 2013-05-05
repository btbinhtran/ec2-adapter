
/**
 * Module dependencies.
 */

var text = require('tower-inflector');

/**
 * Expose `text`.
 */

module.exports = text;

/**
 * All of the descriptions for each parameter.
 *
 * This file doesn't get included by default,
 * since it adds a lot of bulk. It is used
 * on the command-line if you want `--help`.
 * It can be used directly with
 * `require('tower-ec2-adapter/lib/locale')`.
 */

text('ec2.instance.name', 'Name of the instance.');
text('ec2.instance.architecture', 'The instance architecture.');
text('ec2.instance.availability-zone', 'The Availability Zone of the instance.');
text('ec2.instance.dns-name', 'The public DNS name of the instance.');
text('ec2.instance.group-id', 'The ID of the security group for the instance.');
//text.ns('ec2.instance')
//  .text('name', 'Name of the instance')
//  .text('imageId', 'Id of the image');

text('ec2.group.groupId', 'The ID of the security group to modify. The security group must belong to your account.');
text('ec2.group.toPort', 'The end of port range for the TCP and UDP protocols, or an ICMP code number. For the ICMP code number, you can use -1 to specify all ICMP codes for the given ICMP type.');

text('ec2.image.name', 'Name of the image');

text('ec2.instance.min', 'The minimum number of instances to launch. If the value is more than Amazon EC2 can launch, no instances are launched at all.')
text('ec2.instance.max', 'The maximum number of instances to launch. If the value is more than Amazon EC2 can launch, the largest possible number above MinCount will be launched instead.')
text('ec2.instance.key', 'The name of the key pair to use.')
text('ec2.instance.groupName', 'One or more security group names.')

text('ec2.key.name', 'A unique name for the key pair.')
text('ec2.key.body', 'The public key. You must base64 encode the public key material before sending it to AWS.');