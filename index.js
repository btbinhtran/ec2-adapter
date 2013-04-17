
/**
 * Module dependencies.
 */

var adapter = require('tower-adapter')
  , aws = require('aws-lib')
  , address = require('./lib/address')
  , availabilityZone = require('./lib/availability-zone')
  , certificate = require('./lib/certificate')
  , image = require('./lib/image')
  , instance = require('./lib/instance')
  , region = require('./lib/region')
  , route = require('./lib/route')
  , routeTable = require('./lib/route-table')
  , securityGroup = require('./lib/security-group')
  , snapshot = require('./lib/snapshot')
  , tag = require('./lib/tag')
  , volume = require('./lib/volume')
  , ec2;

/**
 * Expose `ec2` adapter.
 */

var exports = module.exports = adapter('ec2')
  , model = exports.model;

/**
 * `Address` model.
 */

model('address')
  .attr('city')
  //.actions(require('./lib/address'));

/**
 * `AvailabilityZone` model.
 */

model('availability-zone')
  .attr('name', 'string', { alias: 'zoneName' })
  .attr('status', 'string', { alias: 'zoneState' })
  .attr('region', 'string', { alias: 'regionName' })
  .stream('find', availabilityZone.find);

model('certificate');

model('image');

/**
 * `Instance` model.
 */

model('instance')
  .id('id', { alias: 'instanceId' })
  .attr('status', { alias: 'instanceState.name' })
  // .action
  .stream('find', instance.find)
  .stream('create', instance.create)
  .stream('remove', instance.remove)

model('region');

model('route');

model('route-table');

model('security-group');

model('snapshot');

model('tag');

model('volume');

/**
 * Connect to ec2.
 */

exports.connect = function(options, fn){
  ec2 = aws.createEC2Client(options.key, options.secret);
  fn();
}

/**
 * Disconnect from ec2.
 */

exports.disconnect = function(options, fn){
  ec2 = undefined;
  fn();
}

/**
 * <item>
    <instanceId>i-1a2b3c4d</instanceId>
    <imageId>ami-1a2b3c4d</imageId>
    <instanceState>
      <code>16</code>
      <name>running</name>
    </instanceState>
    <privateDnsName/>
    <dnsName/>
    <reason/>
    <keyName>gsg-keypair</keyName>
    <amiLaunchIndex>0</amiLaunchIndex>
    <productCodes/>
    <instanceType>c1.medium</instanceType>
    <launchTime>YYYY-MM-DDTHH:MM:SS+0000</launchTime>
    <placement>
      <availabilityZone>us-west-2a</availabilityZone>
      <groupName/>
      <tenancy>default</tenancy>
    </placement>
    <platform>windows</platform>
    <monitoring>
      <state>disabled</state>
    </monitoring>
    <subnetId>subnet-1a2b3c4d</subnetId>
    <vpcId>vpc-1a2b3c4d</vpcId>
    <privateIpAddress>10.0.0.12</privateIpAddress>
    <ipAddress>46.51.219.63</ipAddress>
    <sourceDestCheck>true</sourceDestCheck>
    <groupSet>
      <item>
        <groupId>sg-1a2b3c4d</groupId>
        <groupName>my-security-group</groupName>
      </item>
    </groupSet>
    <architecture>x86_64</architecture>
    <rootDeviceType>ebs</rootDeviceType>
    <rootDeviceName>/dev/sda1</rootDeviceName>
    <blockDeviceMapping>
      <item>
        <deviceName>/dev/sda1</deviceName>
        <ebs>
          <volumeId>vol-1a2b3c4d</volumeId>
          <status>attached</status>
          <attachTime>YYYY-MM-DDTHH:MM:SS.SSSZ</attachTime>
          <deleteOnTermination>true</deleteOnTermination>
        </ebs>
      </item>
    </blockDeviceMapping>
    <virtualizationType>hvm</virtualizationType>
    <clientToken>ABCDE1234567890123</clientToken>
    <tagSet>
      <item>
        <key>Name</key>
        <value>Windows Instance</value>
      </item>
    </tagSet>
    <hypervisor>xen</hypervisor>
    <networkInterfaceSet>
      <item>
        <networkInterfaceId>eni-1a2b3c4d</networkInterfaceId>
        <subnetId>subnet-1a2b3c4d</subnetId>
        <vpcId>vpc-1a2b3c4d</vpcId>
        <description>Primary network interface</description>
        <ownerId>111122223333</ownerId>
        <status>in-use</status>
        <privateIpAddress>10.0.0.12</privateIpAddress>
        <macAddress>1b:2b:3c:4d:5e:6f</macAddress>
        <sourceDestCheck>true</sourceDestCheck>
        <groupSet>
          <item>
            <groupId>sg-1a2b3c4d</groupId>
            <groupName>my-security-group</groupName>
          </item>
        </groupSet>
        <attachment>
          <attachmentId>eni-attach-1a2b3c4d</attachmentId>
          <deviceIndex>0</deviceIndex>
          <status>attached</status>
          <attachTime>YYYY-MM-DDTHH:MM:SS+0000</attachTime>
          <deleteOnTermination>true</deleteOnTermination>
        </attachment>
        <association>
          <publicIp>46.51.219.63</publicIp>
          <ipOwnerId>111122223333</ipOwnerId>
        </association>
        <privateIpAddressesSet>
          <item>
            <privateIpAddress>10.0.0.12</privateIpAddress>
            <primary>true</primary>
            <association>
              <publicIp>46.51.219.63</publicIp>
              <ipOwnerId>111122223333</ipOwnerId>
            </association>
          </item>
          <item>
            <privateIpAddress>10.0.0.14</privateIpAddress>
            <primary>false</primary>
            <association>
              <publicIp>46.51.221.177</publicIp>
              <ipOwnerId>111122223333</ipOwnerId>
            </association>
          </item>
        </privateIpAddressesSet>
      </item>
    </networkInterfaceSet>
  </item>
 */