
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

exports.queryParams = function(ctx, data){
  var args = []
    , params = {}
    , attrs = ctx.constructor.params
    , attr;

  // XXX: need to refactor
  ctx.client = require('tower-adapter')('ec2').client;

  ctx.constraints.forEach(function(constraint, i){
    attr = attrs[constraint[1].left.attr];
    // XXX: should it throw an error if an invalid param is passed?
    var val = constraint[constraint.length - 1].right.value;
    if (attr && attr.format) args.push(attr.format(ctx, attr, val));
  });

  // since EC2 handles all the same way.
  if (data) {
    for (var key in data) {
      attr = attrs[key];

      /**
       * From:
       *
       * { port: '22,80,8080' }
       *
       * To:
       *
       * { 'IpPermissions.1.FromPort': '22',
       *   'IpPermissions.1.toPort': '22',
       *   'IpPermissions.2.FromPort': '80',
       *   'IpPermissions.2.toPort': '80',
       *   'IpPermissions.3.FromPort': '8080',
       *   'IpPermissions.3.toPort': '8080' }
       */

      if (attr && attr.format) args.push(attr.format(ctx, attr, attr.typecast(data[key])));
    }
  }

  args.forEach(function(param, i){
    switch (param.type) {
      case 'filter':
        params['Filter.' + (i + 1) + '.Name'] = param.key
        params['Filter.' + (i + 1) + '.Value.1'] = param.val;
        break;
      default:
        if ('array' === param.kind) {
          // XXX: this type conversion should happen in the query.
          param.val = Array.isArray(param.val) ? param.val : [param.val];
          param.val.forEach(function(x, i){
            if (Array.isArray(param.key)) {
              param.key.forEach(function(key){
                params[key.replace(/\{i\}/g, (i + 1).toString())] = x;
              });
            } else {
              // { 'GroupName.1': 'default' }
              params[param.key.replace(/\{i\}/g, (i + 1).toString())] = x; 
            }
          });
        } else {
          params[param.key] = param.val;
        }
        break;
    }
  });

  return params;
}