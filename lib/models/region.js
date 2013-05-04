
/**
 * Expose `region`.
 */

module.exports = region;

/**
 * Define `region`.
 */

function region(model) {
  model('region')
    .action('find', find);
}

/**
 * Find a region.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeRegions.html
 */

function find(context, data, fn) {

}