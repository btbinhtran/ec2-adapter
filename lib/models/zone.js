
/**
 * Expose `zone`.
 */

module.exports = zone;

/**
 * Define `zone`.
 */

function zone(model) {
  model('zone')
    .attr('name', 'string')
    .attr('status', 'string')
    .attr('region', 'string')
    .action('find', find);
}

/**
 * Find availability zones.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeAvailabilityZones.html
 */

function find(context, data, fn){

}