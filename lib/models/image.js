
/**
 * Module dependencies.
 */

var serializer = require('../serializer');

/**
 * Expose `image`.
 */

module.exports = image;

/**
 * Define `image`.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DeregisterImage.html
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-CopyImage.html
 */

function image(model) {
  model('image')
    .attr('instanceId') // InstanceId, required
    .attr('name') // Name, required, 3-128 alphanumeric characters, parenthesis (()), commas (,), slashes (/), dashes (-), or underscores(_)
    .attr('description', 'text') // Description, 255 characters
    .attr('noReboot', 'boolean', false) // NoReboot
    .action('find', find)
      .param('executable-by', 'array').format('basic', 'ExecutableBy') // ExecutableBy.n
      .param('imageId', 'array')
        .format('basic', 'ImageId')
        .alias('i') // ImageId.n
        // .to(array('ImageId'))
      .param('owner-id', 'array')
        .alias('o') // Owner.n, amazon | aws-marketplace | self | AWS account ID | all
      .param('architecture', 'string')
        .alias('a')
        .format('filter')
        // .type('filter')
        .validate('in', [ 'i386', 'x86_64' ])
      // .format | .sanitize => need way to customize these per adapter/action.
      // .validate
      .param('description', 'text')
        .alias('d')
        .format('filter')
      // how to handle this, since this is both a query param and a filter?
      // .param('image-id')
      .param('image-type', 'string')
        .alias('t') // machine | kernel | ramdisk
      .param('public', 'boolean')
        .alias('p')
        .format('filter', 'is-public')
      .param('kernel-id', 'string')
        .alias('k')
        .format('filter')
      .param('manifest-location')
        .alias('l')
        .format('filter')
      // XXX: need a way to easily see what these variables mean.
      //      maybe a cli command that checks for comments/descriptions.
      // The name of the AMI (provided during image creation).
      .param('name')
        .alias('n')
        .format('filter')
      .param('owner-alias')
        .format('filter')
      .param('platform')
        .alias('p')
        .format('filter')
      .param('product-code')
        .alias('c')
        .format('filter')
      .param('product-code-type').format('filter', 'product-code.type')
      .param('ramdisk-id').format('filter')
      .param('root-device-name').format('filter')
      .param('root-device-type').format('filter')
      .param('status', 'string')
        .alias('s')
        .format('filter', 'state') // available | pending | failed
      //  .as('state', 'filter') // .to('state', 'filter') | .alias('state', 'filter')
      //  .validate('in', [ 'available', 'pending', 'failed' ])
    .action('create', create)
    .action('remove', remove);
}

/**
 * Query images.
 *
 * Since there is no way to paginate with Amazon's API,
 * this saves all the results to a file, which it will
 * only update if `.where('recent').eq(true)` is set.
 *
 * Query Parameters:
 *  - is-public
 *  - kernel-id
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeImages.html
 * @see http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-query-api.html
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/Query-Common-Parameters.html
 * @see http://thecloudmarket.com/#/popular
 * @see https://aws.amazon.com/amis/
 */

function find(ctx, data, fn) {
  var params = serializer.queryParams(ctx);

  ctx.client.call('DescribeImages', params, function(err, result){
    if (err) return fn(err);
    ctx.emit('data', deserializeFind(result));
    fn();
  });
}

/**
 * Create an image.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-RegisterImage.html
 * @see http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/creating-an-ami.html
 */

function create(ctx, data, fn) {
  var options = ctx.data[0] || {};

  var params = {
      'InstanceId': options.id
    , 'Name': options.name
  };

  ctx.ec2.call('InstanceId', params, function(err, result){
    ctx.emit('data', result);
  });
}

/**
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-RegisterImage.html
 */

function register(ctx, data, fn) {

}

/**
 * Deregister image.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DeregisterImage.html
 */

function remove(ctx, data, fn) {
  // ctx.client.call('DeregisterImage');
}

/**
 * Create an image.
 *
 * @see http://robpickering.com/2010/07/create-a-full-backup-image-of-your-amazon-ec2-instance-2-129
 * @see http://www.idevelopment.info/data/AWS/AWS_Tips/AWS_Management/AWS_10.shtml
 * @see http://en.wikipedia.org/wiki/Amazon_Machine_Image
 * @see http://www.quora.com/Amazon-EC2/Whats-the-best-way-to-quickly-scale-up-a-Micro-instance-if-youre-able-to-predict-a-lot-of-traffic-a-few-minutes-in-advance
 * @see https://puppetlabs.com/blog/rapid-scaling-with-auto-generated-amis-using-puppet/
 */

function deserializeFind(result) {
  var items = result.imagesSet.item;
  if (items && !Array.isArray(items)) items = [items];

  return items;
}