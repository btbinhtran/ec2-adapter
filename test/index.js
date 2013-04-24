var ec2 = require('..')
  , graph = require('tower-graph') // XXX: remove
  , query = require('tower-query')
  , assert = require('assert')
  , data = require('./data');

describe('ec2 adapter', function(){
  before(function(done){
    ec2.connect(data.aws, function(){
      // graph.use(ec2);
      done();
    });
  });

  it('should create/remove instances', function(done){
    var imageId = 'ami-7539b41c';

    query().use('ec2').select('instance').action('find').exec().on('data', function(instances){
      // console.log(instances)
      query()
        .use('ec2')
        .select('instance')
        .action('create', [{ imageId: imageId }])
        .exec()
        .on('data', function(newInstances){
          // console.log(newInstances);
          var ids = instances.map(function(i) { return i.id; });

          query()
            .use('ec2')
            .select('instance')
            // .where('id').in(ids)
            .action('remove', instances)
            .exec()
            .on('data', function(instances){
              console.log(instances);
              done();
            });
        });
    });
  });
});