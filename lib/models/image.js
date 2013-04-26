
/**
 * Expose `image`.
 */

module.exports = image;

// XXX: refactor once global variables are figured out;
var queryParams;

/**
 * Define `image`.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DeregisterImage.html
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-CopyImage.html
 */

function image(model, serializer) {
  var basic = serializer.basic
    , filter = serializer.filter;

  queryParams = serializer.queryParams;

  model
    .attr('instanceId') // InstanceId, required
    .attr('name') // Name, required, 3-128 alphanumeric characters, parenthesis (()), commas (,), slashes (/), dashes (-), or underscores(_)
    .attr('description', 'text') // Description, 255 characters
    .attr('noReboot', 'boolean', false) // NoReboot
    .action('find', find)
      .param('executable-by', 'array', basic('ExecutableBy')) // ExecutableBy.n
      .param('imageId', 'array', basic('ImageId')) // ImageId.n
        // .to(array('ImageId'))
      .param('owner-id', 'array') // Owner.n, amazon | aws-marketplace | self | AWS account ID | all
      .param('architecture', 'string')
        .to('filter') // i386 | x86_64
      // .format | .sanitize => need way to customize these per adapter/action.
      // .validate
      .param('description', 'text', filter())
      // how to handle this, since this is both a query param and a filter?
      // .param('image-id')
      .param('image-type', 'string') // machine | kernel | ramdisk
      .param('public', 'boolean', filter('is-public')) // 'is-public'
      .param('kernel-id', 'string', filter())
      .param('manifest-location', filter())
      // XXX: need a way to easily see what these variables mean.
      //      maybe a cli command that checks for comments/descriptions.
      // The name of the AMI (provided during image creation).
      .param('name', filter())
      .param('owner-alias', filter())
      .param('platform', filter())
      .param('product-code', filter())
      .param('product-code-type', filter('product-code.type'))
      .param('ramdisk-id', filter())
      .param('root-device-name', filter())
      .param('root-device-type', filter())
      .param('status', 'string', filter('state')) // available | pending | failed
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
  var params = queryParams(ctx);

  // XXX: query json
  // var json;
  // if (!recent) {
  //   try { json = require('./tmp/images'); } catch (e) {}
  //   if (json)
  // }

  ctx.client.call('DescribeImages', params, function(err, result){
    if (err) return fn(err);
    // require('fs').writeFileSync('tmp/images.json', JSON.stringify(result, null, 2));
    ctx.emit('data', deserializeFind(result));
    fn();
    // fn(err, instances);
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