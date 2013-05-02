
// XXX: refactor
exports.filter = function(name){
  return function(ctx, attr, constraint) {
    if (!name) name = attr.name;
    return { type: 'filter', key: name, val: constraint[constraint.length - 1] };
  }
}

exports.basic = function(name){
  return function(ctx, attr, constraint) {
    if (!name) name = attr.name;
    return { type: 'basic', key: name, val: constraint[constraint.length - 1] };
  }
}

/**
 * General function for converting constraints
 * into ec2 query parameters.
 */

exports.queryParams = function(ctx){
  var args = []
    , params = {}
    , attrs = ctx.constructor.params
    , attr;

  // XXX: need to refactor
  ctx.client = require('tower-adapter')('ec2').client;

  ctx.constraints.forEach(function(constraint, i){
    attr = attrs[constraint[1].left.attr];
    // XXX: should it throw an error if an invalid param is passed?
    if (attr && attr.format) args.push(attr.format(ctx, attr, constraint));
  });

  args.forEach(function(param, i){
    switch (param.type) {
      case 'filter':
        params['Filter.' + (i + 1) + '.Name'] = param.key
        params['Filter.' + (i + 1) + '.Value.1'] = param.val;
        break;
      default:
        params[param.key] = param.val;
        break;
    }
  });

  return params;
}