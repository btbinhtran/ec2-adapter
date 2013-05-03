
/**
 * Module dependencies.
 */

var text = require('tower-inflector');

/**
 * All of the descriptions for each parameter.
 *
 * This file doesn't get included by default,
 * since it adds a lot of bulk. It is used
 * on the command-line if you want `--help`.
 * It can be used directly with
 * `require('tower-ec2-adapter/lib/locale')`.
 */

text('ec2.instance.name', 'Name of the instance');
text.ns('ec2.instance')
  .text('name', 'Name of the instance');
  .text('imageId', 'Id of the image');

text.ns('ec2.group')  
  .text('groupId', 'The ID of the security group to modify. The security group must belong to your account.')
  .text('toPort', 'The end of port range for the TCP and UDP protocols, or an ICMP code number. For the ICMP code number, you can use -1 to specify all ICMP codes for the given ICMP type.');