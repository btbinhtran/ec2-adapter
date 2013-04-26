 
/**
 * Expose `tag`.
 */

module.exports = tag;

/**
 * Define `tag`.
 */

function tag(model) {
  model
    .action('find', find)
    .action('create', create)
    .action('remove', remove);
}

function find(ctx, data, fn) {

}

function create(ctx, data, fn) {
  
}

function remove(ctx, data, fn) {
  
}