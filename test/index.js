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

    query().use('ec2').select('instance').execute(function(err, instances){
      console.log(instances)
      //ec2.create({ imageId: imageId }, function(){
      instances.forEach(function(i){
        query()
          .use('ec2')
          .select('instances')
          .where('id').eq(i.id)
          .action('remove')
          .execute(function(err, res){
            done();
          });
      });
        
      //});
    });
  });
});