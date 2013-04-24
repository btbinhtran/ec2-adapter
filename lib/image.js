
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

exports.find = function(context, data, fn){
  var constraints = context.constraints
    , params = {};

  // params.ImageId = 'ami-7539b41c';

  /**
   * https://ec2.amazonaws.com/?Action=DescribeImages
     &Filter.1.Name=is-public
     &Filter.1.Value.1=true
     &Filter.2.Name=architecture
     &Filter.2.Value.1=x86_64
     &Filter.3.Name=platform
     &Filter.3.Value.1=windows
     &AUTHPARAMS
   */

  var recent = false;

  if (constraints) {
    constraints.forEach(function(i, index){
      var key = i[1].attr
        , op = i[2]
        , val = i[3];

      if ('recent' === key) {
        recent = !!val;
      } else if (queryParams[key](val)) {
        params['Filter.' + (index + 1) + '.Name'] = key;
        params['Filter.' + (index + 1) + '.Value.1'] = val;
      }
    });
  }

  // XXX: query json
  // var json;
  // if (!recent) {
  //   try { json = require('./tmp/images'); } catch (e) {}
  //   if (json)
  // }

  context.ec2.call('DescribeImages', params, function(err, result){
    if (err) return fn(err);
    // require('fs').writeFileSync('tmp/images.json', JSON.stringify(result, null, 2));
    context.emit('data', deserializeFind(result));
    fn();
    // fn(err, instances);
  });
}

function deserializeFind(result) {
  var items = result.imagesSet.item;
  if (items && !Array.isArray(items)) items = [items];

  return items;
}

var queryParams = {
  architecture: function(i) {
    return ~['i386', 'x86_64'].indexOf(i);
  },
  'image-type': function(i) {
    return ~['machine', 'kernel', 'ramdisk'].indexOf(i);
  },
  platform: function(i) {
    return 'windows' === i;
  },
  state: function(i) {
    return ~['available', 'pending', 'failed'].indexOf(i);
  }
}