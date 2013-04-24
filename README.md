# Tower EC2 Adapter

## How to

- AWS Management Console: https://console.aws.amazon.com/console/home
- EC2: https://console.aws.amazon.com/ec2/v2/home
- Credentials: https://portal.aws.amazon.com/gp/aws/securityCredentials

## Installation

```bash
npm install tower-ec2-adapter
```

## Notes

- https://aws.amazon.com/amis/ Amazon Machine Images (AMIs)
- http://blog.rightscale.com/2008/08/20/amazon-ebs-explained/
- http://harish11g.blogspot.com/2013/04/Understanding-Amazon-Elastic-block-store-intro.html
- http://harish11g.blogspot.in/2012/06/aws-high-availability-outage.html
- http://harish11g.blogspot.in/2012/07/amazon-availability-zones-aws-az.html
- http://blog.rightscale.com/2008/03/26/dns-elastic-ips-and-how-things-fit-together-when-upgrading-a-server/
- http://stackoverflow.com/questions/10051533/aws-ec2-elastic-ips-bandwidth-usage-and-charges
- http://support.smartbear.com/articles/testcomplete/using-elastic-ips-for-cloud-testing/
- http://blog.serverdensity.com/global-elastic-ips-multi-region-routing/
- http://techcrunch.com/2013/03/11/aws-just-made-it-a-whole-lot-easier-for-anyone-to-create-a-virtual-private-cloud-showing-again-how-enterprise-tech-is-obsolete/

### Frameworks

- https://github.com/aws/aws-sdk-js

## Licence

MIT


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