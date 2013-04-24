
/**
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeImages.html
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeInstances.html
 */

exports.find = function(context, data, fn){
  context.ec2.call('DescribeInstances', {}, function(err, result){
    context.emit('data', deserializeFind(result));
    fn();
    // fn(err, instances);
  });
}

/**
 * "terminate" removes it, but it won't get removed from the list for 10-20 minutes:
 * https://forums.aws.amazon.com/message.jspa?messageID=420769
 * http://aws.amazon.com/articles/637
 * http://docs.aws.amazon.com/opsworks/latest/userguide/workinginstances-delete.html
 * http://serverfault.com/questions/117123/how-to-delete-instances-in-amazon-ec2-change-pair-key
 * http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-TerminateInstances.html
 */

exports.remove = function(context, data, fn){
  var records = context.data
    , params = {};

  for (var i = 0, n = records.length; i < n; i++) {
    params['InstanceId.' + (i + 1)] = records[i].id;
  }

  //https://ec2.amazonaws.com/?Action=TerminateInstances&InstanceId.1=i-3ea74257&AUTHPARAMS
  context.ec2.call('TerminateInstances', params, function(err, result){
    context.emit('data', deserializeCreate(result));
    fn(); // fn(err, result);
  });
}

/**
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-RunInstances.html
 */

exports.create = function(context, data, fn){
  var options = context.data[0] || {};
  // https://ec2.amazonaws.com/?Action=RunInstances&ImageId=ami-60a54009&MaxCount=3&MinCount=1&Placement.AvailabilityZone=us-east-1b&Monitoring.Enabled=true&AUTHPARAMS
  options.max || (options.max = 1);
  options.min || (options.min = options.max);
  var params = { 'ImageId': options.imageId, 'MaxCount': options.max, 'MinCount': options.min };
  context.ec2.call('RunInstances', params, function(err, result){
    context.emit('data', deserializeCreate(result));
    fn(); // fn(err, result);
  });
}

function deserializeFind(result) {
  var items = result.reservationSet.item;
  if (!Array.isArray(items)) items = [items];

  var instances = []
    , instance;

  if (!items.length) return instances;

  items.forEach(function(i){
    instance = {
        id: i.instancesSet.item.instanceId
      , imageId: i.instancesSet.item.imageId
      , status: i.instancesSet.item.instanceState.name
      , host: i.instancesSet.item.dnsName
      , createdAt: i.instancesSet.item.launchTime
      , ip: i.instancesSet.item.ipAddress
      , architecture: i.instancesSet.item.architecture
      , type: i.instancesSet.item.instanceType
      , placement: i.instancesSet.item.placement.availabilityZone
    };

    instances.push(instance);
  });

  return instances;
}

function deserializeCreate(result) {
  var items = result.instancesSet.item;
  if (!Array.isArray(items)) items = [items];

  var instances = []
    , instance;

  if (!items.length) return instances;

  items.forEach(function(i){
    instance = {
        id: i.instanceId
      , imageId: i.imageId
      , status: (i.instanceState || i.currentState).name
      , host: i.dnsName
      , createdAt: i.launchTime
      , ip: i.ipAddress
      , architecture: i.architecture
      , type: i.instanceType
      , placement: i.placement && i.placement.availabilityZone
    };

    instances.push(instance);
  });

  return instances;
}

// model('instance').on('find', function(params) { ec2.call('DescribeInstances') })
// model('facebook.user').on('find', function(params) { FB.get('/me') })

/**
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-CreateKeyPair.html
 * /credentials
 * model('key-pair').attr('name', 'string').as('KeyName').validate('presence', 'alphanumeric', 'spaces', 'dashes', 'underscores')
 */

/*
{
  "@": {
    "xmlns": "http://ec2.amazonaws.com/doc/2012-12-01/"
  },
  "requestId": "c1980793-7c22-48e7-947f-1b0c858c1013",
  "reservationSet": {
    "item": {
      "reservationId": "r-0febc875",
      "ownerId": "941601121843",
      "groupSet": {
        "item": {
          "groupId": "sg-340eef5f",
          "groupName": "admin-group"
        }
      },
      "instancesSet": {
        "item": {
          "instanceId": "i-c5b640b7",
          "imageId": "ami-7539b41c",
          "instanceState": {
            "code": "16",
            "name": "running"
          },
          "privateDnsName": "ip-10-202-41-241.ec2.internal",
          "dnsName": "ec2-174-129-129-148.compute-1.amazonaws.com",
          "reason": {},
          "keyName": "viatropos",
          "amiLaunchIndex": "0",
          "productCodes": {},
          "instanceType": "t1.micro",
          "launchTime": "2013-03-12T23:29:45.000Z",
          "placement": {
            "availabilityZone": "us-east-1c",
            "groupName": {},
            "tenancy": "default"
          },
          "kernelId": "aki-825ea7eb",
          "monitoring": {
            "state": "disabled"
          },
          "privateIpAddress": "10.202.41.241",
          "ipAddress": "174.129.129.148",
          "groupSet": {
            "item": {
              "groupId": "sg-340eef5f",
              "groupName": "admin-group"
            }
          },
          "architecture": "x86_64",
          "rootDeviceType": "ebs",
          "rootDeviceName": "/dev/sda1",
          "blockDeviceMapping": {
            "item": {
              "deviceName": "/dev/sda1",
              "ebs": {
                "volumeId": "vol-f2f5be82",
                "status": "attached",
                "attachTime": "2013-03-12T23:29:51.000Z",
                "deleteOnTermination": "true"
              }
            }
          },
          "virtualizationType": "paravirtual",
          "clientToken": "OnHDX1363130985371",
          "tagSet": {
            "item": {
              "key": "Name",
              "value": {}
            }
          },
          "hypervisor": "xen",
          "networkInterfaceSet": {},
          "ebsOptimized": "false"
        }
      }
    }
  }
}
*/
/*
[
  {
    "id": "i-3ee74f50",
    "imageId": "ami-7539b41c",
    "status": "shutting-down",
    "host": "ec2-184-73-40-77.compute-1.amazonaws.com",
    "createdAt": "2013-04-16T06:12:28.000Z",
    "ip": "184.73.40.77",
    "architecture": "x86_64"
  },
  {
    "id": "i-c5b640b7",
    "imageId": "ami-7539b41c",
    "status": "running",
    "host": "ec2-174-129-129-148.compute-1.amazonaws.com",
    "createdAt": "2013-03-12T23:29:45.000Z",
    "ip": "174.129.129.148",
    "architecture": "x86_64"
  }
]
a minute or two later, state changes to terminated.
{
    "id": "i-3ee74f50",
    "imageId": "ami-7539b41c",
    "status": "terminated",
    "host": {},
    "createdAt": "2013-04-16T06:12:28.000Z",
    "architecture": "x86_64"
  }
*/