
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