
/**
 * Expose `zone`.
 */

module.exports = zone;

/**
 * Define `zone`.
 */

function zone(model) {
  model
    .attr('name', 'string', { alias: 'zoneName' })
    .attr('status', 'string', { alias: 'zoneState' })
    .attr('region', 'string', { alias: 'regionName' })
    .action('find', find);
}

/**
 * Find availability zones.
 *
 * @see http://docs.aws.amazon.com/AWSEC2/latest/APIReference/ApiReference-query-DescribeAvailabilityZones.html
 */

function find(context, data, fn){

}